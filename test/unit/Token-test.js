import {expect} from 'chai';
import Checkit from 'checkit';
import _ from 'lodash';
import db from '../../lib/db';
import Token from '../../lib/models/Token';

describe('User Model', () => {
  it('Should be a Bookshelf model', () => {
    let token = new Token();
    expect(token).to.be.an.instanceOf(db.Model);
  });

  it('Should have a table name of token', () => {
    let token = new Token();
    expect(token).to.have.property('tableName');
    expect(token.tableName).to.equal('token');
  });

  describe('Validation', () => {
    it('Should throw a validation error if no uid provided', done => {
      let token = new Token();
      token.validateAttributes().asCallback((err, res) => {
        expect(err).to.be.instanceOf(Checkit.Error);
        expect(err).to.be.an('object');
        let errors = err.toJSON();
        expect(errors).to.have.property('uid');
        expect(errors.uid).to.be.an('array');
        expect(errors.uid).to.have.a.lengthOf(1);
        expect(errors.uid[0]).to.equal('The uid is required');
        done();
      });
    });
    it('Should resolve a list of validated attributes if all validation requires are met', done => {
      let token = new Token({uid: '234-5234-23523d23-d23d23'}); // Fake uid
      token.validateAttributes().asCallback((err, res) => {
        expect(err).to.be.null;
        expect(res).to.be.an('object');
        let keys = _.keys(res);
        expect(keys).to.have.a.lengthOf(1);
        expect(keys).to.contain('uid');
        done();
      });
    });
  });
});