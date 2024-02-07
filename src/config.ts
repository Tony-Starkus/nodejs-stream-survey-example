/**
 * This variable is a array of values on the stackoverflow survey to indicate if the user would use the technology.
 * Here we are considering that those values on array is a "yes, I would use it"
 */
const likes = ['interested', 'would_use'];

/**
 * The years that survey was applied
 */
const years = ['2016', '2017', '2018', '2019'];

const defaultY = () => [0, 0, 0, 0];

const lineChartData = {
  angular: {
    title: 'angular',
    x: years,
    y: defaultY(),
    style: {
      // cor vermelho do angular
      line: [170, 42, 44],
    },
  },
  react: {
    title: 'react',
    x: years,
    y: defaultY(),
    style: {
      // cor azul do react
      line: [97, 218, 251],
    },
  },
  vuejs: {
    title: 'vuejs',
    x: years,
    y: defaultY(),
    style: {
      //cor verde do vue
      line: [63, 178, 127],
    },
  },
  ember: {
    title: 'ember',
    x: years,
    y: defaultY(),
    style: {
      // cor laranja do ember
      line: [218, 89, 46],
    },
  },
  backbone: {
    title: 'backbone',
    x: years,
    y: defaultY(),
    style: {
      // cor vede do backbone
      line: [37, 108, 74],
    },
  },
};

export default {
  likes,
  years,
  lineChartData,
  tecnologiesInAnalysis: Reflect.ownKeys(lineChartData),
};
