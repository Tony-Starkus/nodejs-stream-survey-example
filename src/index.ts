import config from './config';
import Controller from './controller';
import Service from './service';
import View from './view';

const outputfileName = 'final.json';
const defaultPath = './docs';
const defaultInputFolder = `${defaultPath}/state-of-js`;
const outputFinal = `${defaultPath}/${outputfileName}`;

const view = new View();

const service = new Service({
  ...config,
  outputFinal,
  defaultInputFolder,
});

(async () => {
  await Controller.initialize({
    view,
    service,
    defaultInputFolder,
    config,
  });
})();
