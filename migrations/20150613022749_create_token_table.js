'use strict';

exports.up = function(knex, Promise) {
  return new Promise.all([
    knex.schema.createTable('token', function(table) {
      table.increments('id').primary();
      table.string('uid', 40).unique();
      table.integer('user_id').references('user.id');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return new Promise.all([
    knex.schema.dropTable('token')
  ]);
};
