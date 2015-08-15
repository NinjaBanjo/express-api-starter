'use strict';

exports.up = function(knex, Promise) {
  return new Promise.all([
    knex.schema.createTable('user', function(table) {
      table.increments('id').primary();
      table.string('username', 100);
      table.string('password', 60);
      table.string('email', 255).unique();
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return new Promise.all([
    knex.schema.dropTable('user')
  ]);
};
