import bookshelf from '../db';
import User from '../models/User';

class Users extends bookshelf.Collection {
  get model() {
    return User
  }
}

export default Users;