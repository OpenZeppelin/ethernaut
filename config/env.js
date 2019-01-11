// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

var REACT_APP = /^REACT_APP_/i;

function getClientEnvironment(publicUrl) {
  var processEnv = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = JSON.stringify(process.env[key]);
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        TOKEN_ADDRESS: JSON.stringify(process.env.TOKEN_ADDRESS),
        TOKEN_NAME: JSON.stringify(process.env.TOKEN_NAME),
        TOKEN_SYM: JSON.stringify(process.env.TOKEN_SYM),
        ROPSTEN_HOST: JSON.stringify(process.env.ROPSTEN_HOST),
        // Useful for resolving the correct path to static assets in `public`.
        // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
        // This should only be used as an escape hatch. Normally you would put
        // images into the `src` and `import` them in code to get their paths.
        PUBLIC_URL: JSON.stringify(publicUrl)
      }
    );
  return { "process.env": processEnv };
}

module.exports = getClientEnvironment;
