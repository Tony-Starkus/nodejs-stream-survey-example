type ToolType = {
  experience: string;
};

export interface SurveyItemInterface {
  survey: string;
  year: number;
  browser_type: string;
  user_agent: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  tools: SurveyToolsInterface;
  sections_other_tools: {};
  other_tools: {};
  opinions: Opinions;
  user_info: UserInfo;
  happiness: Happiness;
}

export interface SurveyToolsInterface {
  vanillajs: ToolType;
  es6: ToolType;
  coffeescript: ToolType;
  typescript: ToolType;
  elm: ToolType;
  clojurescript: ToolType;
  nofrontendframework: ToolType;
  react: ToolType;
  angular: ToolType;
  ember: ToolType;
  vuejs: ToolType;
  backbone: ToolType;
  redux: ToolType;
  mobx: ToolType;
  relay: ToolType;
  rest: ToolType;
  firebase: ToolType;
  graphql: ToolType;
  apollo: ToolType;
  falcor: ToolType;
  horizon: ToolType;
  meteor: ToolType;
  feathers: ToolType;
  donejs: ToolType;
  mern: ToolType;
  mean: ToolType;
  mocha: ToolType;
  jasmine: ToolType;
  enzyme: ToolType;
  jest: ToolType;
  cucumberjs: ToolType;
  ava: ToolType;
  plaincss: ToolType;
  sass: ToolType;
  less: ToolType;
  cssmodules: ToolType;
  aphrodite: ToolType;
  webpack: ToolType;
  grunt: ToolType;
  gulp: ToolType;
  browserify: ToolType;
  bower: ToolType;
  nativeapps: ToolType;
  reactnative: ToolType;
  cordova: ToolType;
  phonegap: ToolType;
  nativescript: ToolType;
}

interface Opinions {
  js_moving_in_right_direction: number;
  building_js_apps_overly_complex: number;
  js_over_used_online: number;
  enjoy_building_js_apps: number;
  would_like_js_to_be_main_lang: number;
  js_ecosystem_changing_to_fast: number;
  survey_too_long: number;
}

interface UserInfo {
  browser_type: string;
  user_agent: string;
  platform: string;
  years_of_experience: string;
  company_size: string;
  yearly_salary: string;
}

interface Happiness {
  javascript_flavors: number;
  front_end_frameworks: number;
  state_management: number;
  data_layer: number;
  backend_frameworks: number;
  testing: number;
  css: number;
  build_tools: number;
  mobile_desktop: number;
}
