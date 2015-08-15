import express from 'express';
import Checkit from 'checkit';
// Models
import User from '../models/User';
// Modules
import Auth from '../modules/Auth';
import Response from '../modules/Response';
import RouteHandlers from '../modules/RouteHandlers';

const AuthController = express.Router();

AuthController.route('/authorize')
  .get(RouteHandlers.notImplemented)
  .post((req, res) => {
    let user;
    new User({username: req.body.username})
      .fetch({require: true})
      .then(_user => {
        user = _user;
        return Auth.compare(req.body.password, user.get('password'));
      })
      .then(result => {
        if (result === true) {
          return Auth.generateToken(user)
            .then(token => {
              new Response(res, {token: token});
            });
        } else {
          throw new Auth.InvalidUserPasswordError();
        }
      })
      .catch(User.NotFoundError, () => {
        new Response(res, new Auth.InvalidUserPasswordError());
      })
      .catch(err => {
        new Response(res, err);
      });
  })
  .put(RouteHandlers.notImplemented)
  .delete(RouteHandlers.notImplemented);

export default AuthController;