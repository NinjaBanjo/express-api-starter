var env = process.env.NODE_ENV || 'production';
console.log(env);
if (env === 'development') {
  require('source-map-support').install();
}

require("babel/register")({
  cache: (env === 'development') ? false : true
});

// Let's get it started in hur
require('./lib/boot');