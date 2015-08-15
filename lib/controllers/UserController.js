import express from 'express';
import Checkit from 'checkit';
// Models
import User from '../models/User';
import Users from '../collections/Users';
// Modules
import Response from '../modules/Response';
import ParamHandlers from '../modules/ParamHandlers';
import RouteHandlers from '../modules/RouteHandlers';

const UserController = express.Router();

UserController.param('user_id', ParamHandlers.userId);

UserController.route('/users')
  .get((req, res) => {
    new Users()
      .fetch()
      .then(collection => {
        new Response(res, collection.toJSON());
      })
      .catch(err => {
        new Response(res, err);
      });
  })
  .post((req, res) => {
    new User(req.body)
      .save()
      .then(user => {
        new Response(res, {id: user.get('id')});
      })
      .catch(err => {
        new Response(res, err);
      });
  })
  .put(RouteHandlers.notImplemented)
  .delete(RouteHandlers.notImplemented);

UserController.route('/users/:user_id')
  .get((req, res) => {
    new Response(res, req.user.toJSON());
  })
  .post(RouteHandlers.notImplemented)
  .put((req, res) => {
    // Set any fields provided in the req
    req.user.set(req.body);
    req.user.save()
      .then(() => {
        new Response(res, {message: 'User updated successfully'});
      })
      .catch(err => {
        new Response(res, err);
      });
  })
  .delete((req, res) => {
    req.user.destroy()
      .then(() => {
        new Response(res, {message: 'User deleted successfully'});
      })
      .catch(err => {
        new Response(res, err);
      });
  });

export default UserController;