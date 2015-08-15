'use strict';

exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    knex('user').del(),

    // Inserts seed entries
    knex('user').insert({id: 1, username: 'billybob', password: '$2a$16$s9SELRrOE4lwkvYbBHQahufgjA0HUeISsMxOfmC2SP2ctoqISjxFu', email: 'someone@something.com'}),
    knex('user').insert({id: 2, username: 'dumbo', password: '$2a$16$s9SELRrOE4lwkvYbBHQahufgjA0HUeISsMxOfmC2SP2ctoqISjxFu', email: 'foo@bar.com'}),
    knex('user').insert({id: 3, username: 'aragorn', password: '$2a$16$s9SELRrOE4lwkvYbBHQahufgjA0HUeISsMxOfmC2SP2ctoqISjxFu', email: 'bar@baz.com'})
  );
};