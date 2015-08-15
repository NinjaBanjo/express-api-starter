import crypto from 'crypto';
import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import jwt from 'jsonwebtoken';
import createError from 'create-error';
import _ from 'lodash';
// Core
import app from '../app';

const tokenOptions = {
  algorithm: 'HS256'
};

const Auth = {
  hash: data => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data, 16, (err, enc) => {
        if (err) reject(err);
        else resolve(enc);
      });
    });
  },
  compare: (data, hash) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(data, hash, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  },
  generateToken: function(user) {
    let uid;
    let newJWT;
    return this.generateUuid()
      .then(_uid => {
        uid = _uid;
        // Resolve with the token
        return Promise.resolve(jwt.sign({
          uid: uid,
          id: user.get('id')
        }, app.get('config').tokenSecret, _.merge(tokenOptions, {expiresInMinutes: 60 * 24})));
      })
      .then(_newJWT => {
        newJWT = _newJWT;
        return user.tokens().create({uid: uid});
      })
      .then(() => {
        return Promise.resolve(newJWT);
      })
      .catch(err => {
        console.log(err.stack);
      });
  },
  verifyToken: token => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, app.get('config').tokenSecret, tokenOptions, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  },
  generateUuid: () => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, function(err, rnd) {
        if (err) {
          reject(err)
          return;
        }
        rnd[6] = (rnd[6] & 0x0f) | 0x40;
        rnd[8] = (rnd[8] & 0x3f) | 0x80;
        rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
        rnd.shift();
        resolve(rnd.join('-'));
      });
    });
  },
  InvalidUserPasswordError: createError('InvalidUserPasswordError')
}

export default Auth;