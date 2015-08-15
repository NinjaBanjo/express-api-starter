import bookshelf from '../db';
import Token from '../models/Token';

class Tokens extends bookshelf.Collection {
  get model() {
    return Token
  }
}

export default Tokens;