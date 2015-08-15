import knex from 'knex';
import bookshelf from 'bookshelf';
import app from './app';

// production/staging imports from outside the project directory
if(['production', 'staging'].indexOf(process.env.NODE_ENV) > -1) {
  var config = require('../../knexfile.js');
} else {
  var config = require('../knexfile.js');
}

debugger;
let env = process.env.NODE_ENV || 'production';
const validDbEnv = ['testing', 'development', 'staging', 'production'];
if(validDbEnv.indexOf(env) === -1) {
  env = 'production';
}

const db = bookshelf(knex(config[env])).plugin('visibility');
// A singleton instance of bookshelf because bookshelf doesn't do this itself (yet) https://github.com/tgriesser/bookshelf/issues/552
export default db;