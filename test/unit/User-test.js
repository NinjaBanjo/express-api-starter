import {expect} from 'chai';
import Checkit from 'checkit';
import _ from 'lodash';
import db from '../../lib/db';
import User from '../../lib/models/User';

describe('User Model', () => {
  it('Should be a Bookshelf model', () => {
    let user = new User();
    expect(user).to.be.an.instanceOf(db.Model);
  });

  it('Should have a table name of user', () => {
    let user = new User();
    expect(user).to.have.property('tableName');
    expect(user.tableName).to.equal('user');
  });

  describe('Validation', () => {
    it('Should throw a validation error if no email provided', done => {
      let user = new User({username: 'someone', password: 'kibbles'});
      user.validateAttributes().asCallback((err, res) => {
        expect(err).to.not.be.null;
        expect(err).to.be.instanceOf(Checkit.Error);
        let errors = err.toJSON();
        expect(errors).to.have.property('email');
        expect(errors.email).to.be.an('array');
        expect(errors.email).to.have.a.lengthOf(1);
        expect(errors.email[0]).to.equal('The email is required');
        done();
      });
    });
    it('Should throw a validation error on invalid email', done => {
      let user = new User({username: 'someone', email: 'kibbles@bits', password: 'kibbles'});
      user.validateAttributes().asCallback((err, res) => {
        expect(err).to.not.be.null;
        expect(err).to.be.instanceOf(Checkit.Error);
        let errors = err.toJSON();
        expect(errors).to.have.property('email');
        expect(errors.email).to.be.an('array');
        expect(errors.email).to.have.a.lengthOf(1);
        expect(errors.email[0]).to.equal('The email must be a valid email address');
        done();
      });
    });
    it('Should throw a validation error if no password provided', done => {
      let user = new User({username: 'someone', email: 'kibbles@bits.com'});
      user.validateAttributes().asCallback((err, res) => {
        expect(err).to.not.be.null;
        expect(err).to.be.instanceOf(Checkit.Error);
        let errors = err.toJSON();
        expect(errors).to.have.property('password');
        expect(errors.password).to.be.an('array');
        expect(errors.password).to.have.a.lengthOf(1);
        expect(errors.password[0]).to.equal('The password is required');
        done();
      });
    });
    it('Should throw a validation error if no username provided', done => {
      let user = new User({email: 'kibbles@bits.com', password: 'kibbles'});
      user.validateAttributes().asCallback((err, res) => {
        expect(err).to.not.be.null;
        expect(err).to.be.instanceOf(Checkit.Error);
        let errors = err.toJSON();
        expect(errors).to.have.property('username');
        expect(errors.username).to.be.an('array');
        expect(errors.username).to.have.a.lengthOf(1);
        expect(errors.username[0]).to.equal('The username is required');
        done();
      });
    });
    it('Should resolve a list of validated attributes if all validation requirements are met', done => {
      let user = new User({username: 'something', email: 'kibbles@bits.com', password: 'kibbles'});
      user.validateAttributes().asCallback((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        let keys = _.keys(res);
        expect(keys).to.have.a.lengthOf(3);
        expect(keys).to.contain('username');
        expect(keys).to.contain('email');
        expect(keys).to.contain('password');
        done();
      });
    });
  });
});