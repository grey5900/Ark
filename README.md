# Universal Health System

## Installation

```bash
npm install
```

## Running Dev Server

```bash
npm run dev:prepare-dll
npm run dev:prepare
npm run dev
```

The first time it may take a little while to generate the first `webpack-assets.json` and complain with a few dozen `[webpack-isomorphic-tools] (waiting for the first Webpack build to finish)` printouts, but be patient. Give it 30 seconds.

### Using Redux DevTools

[Redux Devtools](https://github.com/gaearon/redux-devtools) are enabled by default in development.

- <kbd>CTRL</kbd>+<kbd>H</kbd> Toggle DevTools Dock
- <kbd>CTRL</kbd>+<kbd>Q</kbd> Move DevTools Dock Position
- see [redux-devtools-dock-monitor](https://github.com/gaearon/redux-devtools-dock-monitor) for more detailed information.

If you have the 
[Redux DevTools chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) installed it will automatically be used on the client-side instead.

If you want to disable the dev tools during development, set `__DEVTOOLS__` to `false` in `/webpack/dev.config.js`.  
DevTools are not enabled during production.

## Building and Running Production Server

```bash
npm run build
npm run start
```

## Explanation

What initially gets run is `bin/server.js`, which does little more than enable ES6 and ES7 awesomeness in the
server-side node code. It then initiates `server.js`. In `server.js` we proxy any requests to `/api/*` to the
[API server](#api-server), running at `localhost:3030`. All the data fetching calls from the client go to `/api/*`.
Aside from serving the favicon and static content from `/static`, the only thing `server.js` does is initiate delegate
rendering to `react-router`. At the bottom of `server.js`, we listen to port `3000` and initiate the API server.

#### Routing and HTML return

The primary section of `server.js` generates an HTML page with the contents returned by `react-router`. First we instantiate an `ApiClient`, a facade that both server and client code use to talk to the API server. On the server side, `ApiClient` is given the request object so that it can pass along the session cookie to the API server to maintain session state. We pass this API client facade to the `redux` middleware so that the action creators have access to it.

Then we perform [server-side data fetching](#server-side-data-fetching), wait for the data to be loaded, and render the page with the now-fully-loaded `redux` state.

The last interesting bit of the main routing section of `server.js` is that we swap in the hashed script and css from the `webpack-assets.json` that the Webpack Dev Server – or the Webpack build process on production – has spit out on its last run. You won't have to deal with `webpack-assets.json` manually because [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) take care of that.

We also spit out the `redux` state into a global `window.__data` variable in the webpage to be loaded by the client-side `redux` code.

#### Server-side Data Fetching

The [redux-connect](https://www.npmjs.com/package/redux-connect) package exposes an API to return promises that need to be fulfilled before a route is rendered. It exposes a `<ReduxAsyncConnect />` container, which wraps our render tree on both [server](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/server.js) and [client](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/client.js). More documentation is available on the [redux-connect](https://www.npmjs.com/package/redux-connect) page.

#### Client Side

The client side entry point is reasonably named `client.js`. All it does is load the routes, initiate `react-router`, rehydrate the redux state from the `window.__data` passed in from the server, and render the page over top of the server-rendered DOM. This makes React enable all its event listeners without having to re-render the DOM.

#### Redux Middleware

The middleware, [`clientMiddleware.js`](https://github.com/erikras/react-redux-universal-hot-example/blob/master/src/redux/middleware/clientMiddleware.js), serves two functions:

1. To allow the action creators access to the client API facade. Remember this is the same on both the client and the server, and cannot simply be `import`ed because it holds the cookie needed to maintain session on server-to-server requests.
2. To allow some actions to pass a "promise generator", a function that takes the API client and returns a promise. Such actions require three action types, the `REQUEST` action that initiates the data loading, and a `SUCCESS` and `FAILURE` action that will be fired depending on the result of the promise. There are other ways to accomplish this, some discussed [here](https://github.com/rackt/redux/issues/99), which you may prefer, but to the author of this example, the middleware way feels cleanest.

#### Redux Modules... *What the Duck*?

The `src/redux/modules` folder contains "modules" to help
isolate concerns within a Redux application (aka [Ducks](https://github.com/erikras/ducks-modular-redux), a Redux Style Proposal that I came up with). I encourage you to read the
[Ducks Docs](https://github.com/erikras/ducks-modular-redux) and provide feedback.

#### API Server

This is where the meat of your server-side application goes. It doesn't have to be implemented in Node or Express at all. This is where you connect to your database and provide authentication and session management. In this example, it's just spitting out some json with the current time stamp.

#### Getting data and actions into components

To understand how the data and action bindings get into the components – there's only one, `InfoBar`, in this example – I'm going to refer to you to the [Redux](https://github.com/gaearon/redux) library. The only innovation I've made is to package the component and its wrapper in the same js file. This is to encapsulate the fact that the component is bound to the `redux` actions and state. The component using `InfoBar` needn't know or care if `InfoBar` uses the `redux` data or not.

#### Images

Now it's possible to render the image both on client and server. Please refer to issue [#39](https://github.com/erikras/react-redux-universal-hot-example/issues/39) for more detail discussion, the usage would be like below (super easy):

```javascript
let logoImage = require('./logo.png');
```

#### Unit Tests

The project uses [Mocha](https://mochajs.org/) to run your unit tests, it uses [Karma](http://karma-runner.github.io/0.13/index.html) as the test runner, it enables the feature that you are able to render your tests to the browser (e.g: Firefox, Chrome etc.), which means you are able to use the [Test Utilities](http://facebook.github.io/react/docs/test-utils.html) from Facebook api like `renderIntoDocument()`.

To run the tests in the project, just simply run `npm test` if you have `Chrome` installed, it will be automatically launched as a test service for you.

To keep watching your test suites that you are working on, just set `singleRun: false` in the `karma.conf.js` file. Please be sure set it to `true` if you are running `npm test` on a continuous integration server (travis-ci, etc).

## FAQ

This project moves fast and has an active community, so if you have a question that is not answered below please visit our [Discord channel](https://discord.gg/0ZcbPKXt5bZZb1Ko) or file an issue.

* [Inline Styles](docs/InlineStyles.md) - CSS is dead
