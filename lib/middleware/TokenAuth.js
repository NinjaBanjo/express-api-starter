import Auth from '../modules/Auth';
import moment from 'moment';

export default class TokenAuth {
  constructor(requireRole) {
    this.requiredRole = requireRole;
  }

  auth() {
    return function(req, res, next) {
      const token = req.get('authorization');
      if (token) {
        Auth.verifyToken(token)
          .then(contents => {
            if(moment.utc(contents.exp).isBefore(moment.utc())) {
              next();
            } else {
              res.status(401).json({error: true, data: {message: 'Token expired'}});
            }
          })
          .catch(err => {
            res.status(401).json({error: true, data: {message: 'Token invalid'}});
          })
      } else {
        res.status(401).json({error: true, data: {message: 'Token not provided'}});
      }
    }.bind(this);
  }
}