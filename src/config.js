require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const {HOST, PORT, APIHOST, APIPORT, BUGHOST, BUGPORT} = process.env;
module.exports = Object.assign({
  host: HOST || 'localhost',
  port: PORT,
  rootURL: '/asset',
  apiHost: APIHOST || 'localhost',
  apiPort: APIPORT,
  bugReportURL: `http://${BUGHOST || 'localhost'}:${BUGPORT || (parseInt(APIPORT, 10) + 1)}/report`,
  app: {
    title: 'UHS',
    description: '',
    head: {
      titleTemplate: 'UHS: %s',
      meta: [
        {name: 'description', content: ''},
        {charset: 'utf-8'},
        {property: 'og:site_name', content: 'UHS'},
        {property: 'og:locale', content: 'zh_CN'},
        {property: 'og:title', content: 'UHS'},
        {property: 'og:description', content: 'Universal Health System.'},
        {property: 'og:card', content: 'summary'},
        {property: 'og:site', content: '@lxm'},
        {property: 'og:creator', content: '@lxm'},
        {property: 'og:image:width', content: '200'},
        {property: 'og:image:height', content: '200'}
      ]
    }
  }

}, environment);
