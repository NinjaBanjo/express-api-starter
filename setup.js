var fs = require('fs');
var crypto = require('crypto');
var Promise = require('bluebird');
var env = process.env.NODE_ENV || 'production';
var configPath = './config.json';

// Do development specific stuff
if (env === 'development') {

}

// stuff that always happens
// Get an existing config file so we don't overwrite existing stuff unless explicitly told to
if (fs.existsSync('./config.json')) {
  var config = JSON.parse(fs.readFileSync('./config.json', {encoding: 'utf8'}));
} else {
  config = {};
}

// Build config file with secret key
readConfig()
  .then(function(configData) {
    config = configData;
  })
  .then(function() {
    if (config.tokenSecret) return Promise.resolve();
    else return generateSecret(64)
      .then(function(secret) {
        config.tokenSecret = secret;
        console.log('Generated tokenSecret successfully')
        return Promise.resolve();
      });
  })
  .then(function() {
    return writeConfig(config);
  })
  .then(function() {
    process.exit(0);
  })
  .catch(function(err) {
    console.log(err.stack);
    process.exit(1);
  });

function readConfig() {
  return new Promise(function(resolve, reject) {
    fs.exists(configPath, function(exists) {
      if (!exists) resolve({});
      else {
        fs.readFile(configPath, {encoding: 'utf8'}, function(err, data) {
          if (err) reject(err);
          else resolve(JSON.parse(data));
        });
      }
    });
  });
}

function writeConfig(objectData) {
  var configJSON = JSON.stringify(objectData);
  return new Promise(function(resolve, reject) {
    fs.writeFile(configPath, configJSON, {encoding: 'utf8'}, function(err) {
      if (err) reject(err);
      else resolve();
    })
  });
}

function generateSecret(byteLength) {
  return new Promise(function(resolve, reject) {
    crypto.randomBytes(byteLength, function(err, buf) {
      if (err) reject(err);
      else resolve(buf.toString('hex'));
    });
  });
}