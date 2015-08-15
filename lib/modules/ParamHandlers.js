import User from '../models/User';
import Response from './Response';

export default {
  userId(req, res, next, id) {
    User.forge({
      id: id
    })
      .fetch({require: true})
      .then(user => {
        req.user = user;
        next();
      })
      .catch(err => {
        new Response(res, err);
      });
  }
}