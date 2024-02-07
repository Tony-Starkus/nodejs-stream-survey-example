import Event from 'events';
import View, { OnProgressUpdatedMethodProps } from './view';
import Service from './service';
import config from './config';

type ConfigType = typeof config;

interface ControllerConstructorProps {
  view: View;
  service: Service;
  defaultInputFolder: string;
  config: typeof config;
}

export interface ToolsPerYear {
  [x: number]: { [x: string]: number };
}

export default class Controller {
  view: View;
  service: Service;
  defaultInputFolder: string;
  config: ConfigType;

  constructor({ view, service, defaultInputFolder, config }: ControllerConstructorProps) {
    this.view = view;
    this.service = service;
    this.config = config;
    this.defaultInputFolder = defaultInputFolder;
  }

  /**
   * This method instance a new Controller instance and then call init method.
   * @param args
   */
  static async initialize(args: ControllerConstructorProps) {
    const controller = new Controller(args);
    return await controller.#init();
  }

  async #init() {
    const graphNotifier = new Event();
    const progressNotifier = new Event();

    this.view.initialize();

    progressNotifier.on('update', this.handleProgressBarUpdate.bind(this));

    graphNotifier.on('update', this.handleGraphUpdate.bind(this));

    try {
      await this.service.runPipeline({
        graphNotifier,
        progressNotifier,
      });
    } catch (error: any) {
      console.log(error);
      console.log({ error: error.message });
    }
  }

  handleGraphUpdate(item: ToolsPerYear) {
    this.view.buildLineChart();
    const lineChartData = this.service.onLineChartUpdate(item);
    this.view.updateLineChart(lineChartData);
  }

  /**
   * Dispatch action to view to update progress bar
   * @param item Object with progress data
   * @returns void
   */
  handleProgressBarUpdate(item: OnProgressUpdatedMethodProps) {
    return this.view.onProgressUpdated(item);
  }
}
