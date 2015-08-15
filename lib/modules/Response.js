import Checkit from 'checkit';
import bookshelf from '../db';
import Auth from '../modules/Auth';

class Response {
  constructor(res, data) {
    // defaults
    this.data = data || {};
    this.isError = false;
    this.statusCode = 200;
    // Morph the internal data for use
    this.morphData()
    if (!this.isError) {
      res.json({error: false, data: this.data});
    } else {
      res.status(this.getStatus()).json({error: true, data: this.data});
    }
  }

  morphData() {
    if (this.data instanceof Error) {
      this.isError = true;
      this.buildError();
    }
    switch (typeof this.data) {
      case 'string':
        this.data = {message: this.data};
        break;
      case 'number':
        this.data = {message: this.data}
        break;
      default:
        break;
    }
    // If no message was set, indicate it
    // We always need to send a message property
    if (Object.keys(this.data).length < 1) {
      this.data.message = 'No message';
    }
  }

  getStatus() {
    return this.statusCode;
  }

  buildError() {
    if(this.data instanceof SyntaxError) {
      this.statusCode = 400;
      this.data = {
        message: 'Invalid JSON'
      }
    } else if (this.data instanceof Checkit.Error) {
      this.statusCode = 400;
      this.data = {
        type: 'ValidationError',
        message: this.data.toJSON()
      };
    } else if (this.data instanceof bookshelf.Model.NotFoundError) {
      this.statusCode = 400;
      this.data = {
        type: 'NotFoundError',
        message: 'Invalid ID'
      }
    } else if (this.data instanceof bookshelf.Model.NoRowsDeletedError) {
      this.statusCode = 409;
      this.data = {
        type: 'DeleteError',
        message: 'Delete failed due to conflict'
      }
    } else if (this.data instanceof Auth.InvalidUserPasswordError) {
      this.statusCode = 400;
      this.data = {
        type: 'InvalidUserPasswordError',
        message: 'Invalid username/password'
      }
    } else {
      this.statusCode = 500;
      this.data = {
        type: 'Error',
        message: 'An unknown error occurred'
      };
    }
  }
}

export default Response;