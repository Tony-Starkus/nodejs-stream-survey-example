import { statSync, createReadStream, createWriteStream } from 'fs';
import { readdir } from 'fs/promises';
import { join } from 'path';

import { pipeline } from 'stream';
import { promisify } from 'util';
import split from 'split2';

import StreamConcat from 'stream-concat';
import Event from 'events';
import { SurveyItemInterface, SurveyToolsInterface } from './interfaces/survey';
import { ToolsPerYear } from './controller';

const pipelineAsync = promisify(pipeline);

interface ServiceConstructorPropsInterface {
  years: string[];
  likes: string[];
  lineChartData: any;
  outputFinal: string;
  tecnologiesInAnalysis: any;
  defaultInputFolder: string;
}

interface RunPipelineMethodPropsInterface {
  graphNotifier: Event;
  progressNotifier: Event;
}

interface RunProcessMethodPropsInterface {
  stream: any;
  graphNotifier: Event;
  progressNotifier: Event;
  filesSize: number;
}

export default class Service {
  #years: string[];
  #likes: string[];
  #lineChartData: any;
  #outputFinal: string;
  #tecnologiesInAnalysis: any;
  #defaultInputFolder: string;

  constructor({
    years,
    likes,
    lineChartData,
    outputFinal,
    defaultInputFolder,
    tecnologiesInAnalysis,
  }: ServiceConstructorPropsInterface) {
    this.#years = years;
    this.#likes = likes;
    this.#lineChartData = lineChartData;
    this.#outputFinal = outputFinal;
    this.#tecnologiesInAnalysis = tecnologiesInAnalysis;
    this.#defaultInputFolder = defaultInputFolder;
  }

  /**
   * This method call function to prepare streams and then start the process
   * @param {RunPipelineMethodPropsInterface}
   * @returns
   */
  async runPipeline({ graphNotifier, progressNotifier }: RunPipelineMethodPropsInterface) {
    const result = await this.prepareStreams(this.#defaultInputFolder);
    return this.runProcess({
      ...result,
      graphNotifier,
      progressNotifier,
    });
  }

  /**
   * This method read all files in the folder, create the streams and sum the files size
   * @param folder The folder to read the files
   * @returns Return an array of streams and the sum of files size
   */
  async prepareStreams(folder: string) {
    const files = await readdir(folder);
    const filesSize = this.getFilesSize(files, folder);

    const streams = files.map((file) => createReadStream(join(folder, file)));

    const stream = new StreamConcat(streams);

    return { stream, filesSize };
  }

  /**
   * This method run the pipeline on stream
   * @param param0
   * @returns
   */
  async runProcess({ stream, graphNotifier, progressNotifier, filesSize }: RunProcessMethodPropsInterface) {
    return pipelineAsync(
      stream,
      this.handleProgressBar(filesSize, progressNotifier),
      // Break up a stream and reassemble it so that each line is a chunk
      split(JSON.parse),
      this.mapFunction.bind(this),
      this.aggregate(graphNotifier),
      createWriteStream(this.#outputFinal)
    );
  }

  /**
   * This method emit notifies progressNotifier about stream data incoming
   * @param filesSize Total size of the files
   * @param progressNotifier The progress notifier event
   */
  handleProgressBar(filesSize: number, progressNotifier: Event) {
    let processedAlready = 0;

    async function* progressBar(source: any) {
      for await (const data of source) {
        processedAlready += data.length;
        progressNotifier.emit('update', { processedAlready, filesSize });
        yield data;
      }
    }

    return progressBar.bind(this);
  }

  /**
   * This transform method get each survey answer and extract the preferred languagues
   * 
   * @example
   * return {
      react: true,
      vuejs: false,
      angular: true,
      ember: false
      year: 2016
    }

   * @param source 
   */
  async *mapFunction(source: any) {
    const likes = this.#likes;

    for await (const _data of source) {
      const data = _data as SurveyItemInterface;
      const tools = data.tools;

      /**
       * This function creates an object where key is technology name and value is a boolean to indicate if
       * user likes that technology.
       * 
       * @example
       * return {
          react: true,
          vuejs: false,
          angular: true,
          ember: false
        }
       * 
       * @param {keyof SurveyToolsInterface} tech 
       * @returns [x: string]: boolean
       */
      function mapTecnologiesInAnalisys(tech: keyof SurveyToolsInterface) {
        return {
          [tech]: likes.includes(tools?.[tech]?.experience),
        };
      }

      const item = this.mergeListIntoObject({
        list: this.#tecnologiesInAnalysis,
        mapper: mapTecnologiesInAnalisys,
      });

      // Add the year of the survey
      const finalItem = {
        ...item,
        year: data.year,
      };

      yield finalItem;
    }
  }

  aggregate(graphNotifier: Event) {
    async function* feedGraph(this: Service, source: any) {
      const yearsInContext = this.aggregateItemsPerYear(this.#years);

      for await (const data of source) {
        const year = data.year.toString();
        Reflect.deleteProperty(data, 'year');

        /**
         * Count votes for each technology in each year
         *
         * @example
         * key = 'react'
         * year = 2017
         * data[key] = data['react'] = ou false ou true, = ou 0 ou 1
         * yearsInContext[2017][react] += 1 ou 0
         */
        Reflect.ownKeys(data).forEach((key) => (yearsInContext[year][key] += data[key]));
      }

      graphNotifier.emit('update', yearsInContext);

      yield JSON.stringify(yearsInContext);
    }

    return feedGraph.bind(this);
  }

  onLineChartUpdate(item: ToolsPerYear) {
    Reflect.ownKeys(item).map((year) => {
      const indexYear = this.#years.indexOf(year.toString());
      const { total, ...yearContext } = item[Number(year)];

      Reflect.ownKeys(yearContext).map((lib: any) => (this.#lineChartData[lib].y[indexYear] = yearContext[lib]));
    });

    return Object.values(this.#lineChartData);
  }

  /**
   * This method gets an array and a map function, and return an object based on map function provided
   * @returns Object
   */
  mergeListIntoObject({ list, mapper }: { list: any; mapper: any }) {
    return list.map(mapper).reduce((prev: any, next: any) => ({ ...prev, ...next }), {});
  }

  /**
   * This method return an object where keys are the years in analisys and value
   * is an object of technologies in analisys
   * 
   * @example
   * years = ['2016, '2017,]
   * return {
        "2016": {
          angular: 0,
          react: 0,
          vuejs: 0,
          ember: 0,
          backbone: 0,
          total: 0,
        },
        "2017": {
          angular: 0,
          react: 0,
          vuejs: 0,
          ember: 0,
          backbone: 0,
          total: 0,
        },
       }
   * 
   * @param {Array<string>} years Array of years in analisys 
   * @returns {Object}
   */
  aggregateItemsPerYear(years: string[]) {
    /**
     * Object where keys are the technologies in analisys and value is zero
     *
     * @example
     * {
     *  angular: 0,
     *  react: 0,
     *  vuejs: 0
     * }
     */
    const initialValues = this.mergeListIntoObject({
      list: this.#tecnologiesInAnalysis,
      mapper: (item: string) => ({ [item]: 0 }),
    });

    const mapItemsPerYear = (year: string) => ({
      [year]: {
        ...initialValues,
        get total() {
          return Reflect.ownKeys(this)
            .filter((key) => key !== 'total')
            .map((key) => this[key])
            .reduce((prev, next) => prev + next, 0);
        },
      },
    });

    return this.mergeListIntoObject({
      list: years,
      mapper: mapItemsPerYear,
    });
  }

  /**
   * This method sum the size of provided files inside a folder
   * @param files Array of files name
   * @param folder The folder path
   * @returns The sum of files size
   */
  getFilesSize(files: string[], folder: string) {
    return files.map((file) => statSync(join(folder, file)).size).reduce((prev, next) => prev + next, 0);
  }
}
