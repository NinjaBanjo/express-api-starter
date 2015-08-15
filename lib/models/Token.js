import bookshelf from '../db';
import checkit from 'checkit';
import Promise from 'bluebird';
import _ from 'lodash';
import User from './User';

class Token extends bookshelf.Model {
  get tableName() {
    return 'token'
  }

  initialize() {
    this.on('saving', this.onSaving);
  }

  user() {
    return this.belongsTo(User, 'user_id');
  }

  get validAttributes() {
    return [
      'id',
      'uid',
      'user_id',
      'created_at',
      'updated_at'
    ]
  }

  onSaving() {
    return this.cleanAttributes()
      .then(this.validateAttributes.bind(this));
  }

  validateAttributes() {
    return checkit({
      uid: 'required'
    }).run(this.attributes);
  }

  cleanAttributes() {
    var cleanAttributes = _.pick(this.attributes, this.validAttributes);
    this.attributes = cleanAttributes;
    return Promise.resolve();
  }
}

export default Token;