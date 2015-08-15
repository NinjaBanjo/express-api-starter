import bookshelf from '../db';
import Checkit from 'checkit';
import Promise from 'bluebird';
import _ from 'lodash';
import Auth from '../modules/Auth';
import Tokens from '../collections/Tokens';

class User extends bookshelf.Model {
  get tableName() {
    return 'user'
  }

  initialize() {
    this.on('saving', this.onSaving);
  }

  tokens() {
    return this.hasMany(Tokens);
  }

  get hidden() {
    return ['password']
  }

  get validAttributes() {
    return [
      'username',
      'email',
      'password',
      'id'
    ]
  }

  onSaving() {
    return this.cleanAttributes()
      .then(this.validateAttributes.bind(this))
      .then(this.hashPassword.bind(this));
  }

  validateAttributes() {
    return new Checkit({
      username: 'required',
      password: 'required',
      email: ['required', 'email']
    }).run(this.attributes);
  }

  cleanAttributes() {
    var cleanAttributes = _.pick(this.attributes, this.validAttributes);
    this.attributes = cleanAttributes;
    return Promise.resolve();
  }

  hashPassword() {
    if (this.isNew === true || this.hasChanged('password')) {
      return Auth.hash(this.get('password'))
        .then(hash => {
          this.set('password', hash);
          return Promise.resolve();
        })
    }
    return Promise.resolve();
  }
}

export default User;