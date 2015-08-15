#!/bin/bash
echo "Running pre-start setup"
node ./setup.js
echo "Migrating Database"
node ./node_modules/.bin/knex migrate:latest
echo "Database Migration Successful"