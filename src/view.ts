import blessed from 'blessed';
import contrib from 'blessed-contrib';

export interface OnProgressUpdatedMethodProps {
  processedAlready: number;
  filesSize: number;
}

export default class View {
  screen: blessed.Widgets.Screen | null;
  lastProgressUpdated: number;
  progressBar: contrib.Widgets.DonutElement | null;
  lineChart: contrib.Widgets.LineElement | null;

  constructor() {
    this.screen = null;
    this.lastProgressUpdated = 0;

    this.progressBar = null;
    this.lineChart = null;
  }

  initialize() {
    this.buildInterface();
    this.buildProgressBar();
  }

  /**
   * This method start blessed terminal screen and set the keywords to stop the terminal.
   * @returns {blessed.Widgets.Screen}
   */
  buildInterface() {
    this.screen = blessed.screen();
    const screen = this.screen;
    screen.key(['scape', 'q', 'C-c'], () => process.exit(0));
    screen.render();

    return screen;
  }

  /**
   * This method creates and render a donut progress bar on terminal
   */
  buildProgressBar() {
    this.progressBar = contrib.donut({
      left: 'center',
      top: 'center',
      height: '50%',
      width: '50%',

      radius: 8,
      arcWidth: 3,
      remainColor: 'black',
      yPadding: 2,
    });

    this.screen!.append(this.progressBar);
    this.screen!.render();
  }

  /**
   * This method creates and render a line chart on terminal
   * @returns
   */
  buildLineChart() {
    if (this.lineChart) return;

    this.lineChart = contrib.line({
      left: 'center',
      top: 'center',
      border: 'line',
      height: '100%',
      width: '100%',
      label: 'Frameworks Most Used per Year',
    });

    this.screen?.append(this.lineChart);
  }

  updateLineChart(lineChartData: any) {
    this.lineChart?.setData(lineChartData);
    this.screen?.render();
  }

  onProgressUpdated({ processedAlready, filesSize }: OnProgressUpdatedMethodProps) {
    const alreadyProcessed = Math.ceil((processedAlready / filesSize) * 100);

    if (this.lastProgressUpdated === processedAlready) return;

    this.lastProgressUpdated = alreadyProcessed;

    this.progressBar?.setData([{ percent: alreadyProcessed.toString(), label: 'processing...', color: 'green' }]);

    this.screen?.render();
  }
}
