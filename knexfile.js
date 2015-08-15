// Update with your config settings.

module.exports = {

  testing: {
    client: 'sqlite3',
    connection: {
      filename: './test.sqlite'
    },
    pool: {
      afterCreate: function(conn, cb) {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    }
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite'
    },
    pool: {
      afterCreate: function(conn, cb) {
        conn.run('PRAGMA foreign_keys = ON', cb);
      }
    },
    debug: true
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
