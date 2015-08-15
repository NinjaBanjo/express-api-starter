import {expect} from 'chai';
import supertest from 'supertest';
import app from '../../../lib/app';
import db from '../../../lib/db';
import _ from 'lodash';

let api = supertest('localhost:3333');

describe('Auth Routes', () => {
  let server;

  before(done => {
    server = app.listen(3333, () => {
      done();
    });
  });

  after(() => {
    server.close();
  });

  beforeEach(done => {
    db.knex.migrate.latest()
      .then(() => {
        return db.knex.seed.run();
      })
      .then(() => {
        done();
      });
  });

  afterEach(done => {
    db.knex.migrate.rollback()
      .then(() => {
        done();
      });
  });
  describe('/authorize', () => {
    describe('GET', () => {
      it('Should return 501', done => {
        api.get('/authorize')
          .expect(501, done);
      });
    });
    describe('POST', () => {
      it('should return 400 with proper error on invalid username', done => {
        api.post('/authorize')
          .send({username: 'horton', password: 'quibles'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.true;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.equal('Invalid username/password');
            done();
          });
      });
      it('should return 400 with proper error on invalid password', function(done) {
        this.timeout(10000);
        api.post('/authorize')
          .send({username: 'billybob', password: 'quibles'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.true;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.equal('Invalid username/password');
            done();
          });
      });
      it('should return 200 with token on valid username/password', function(done) {
        this.timeout(10000);
        api.post('/authorize')
          .send({username: 'billybob', password: 'something'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.false;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('token');
            expect(res.body.data.token).to.not.be.empty;
            done();
          });
      });
    });
    describe('PUT', () => {
      it('Should return 501', done => {
        api.put('/authorize')
          .expect(501, done);
      });
    });
    describe('DELETE', () => {
      it('Should return 501', done => {
        api.del('/authorize')
          .expect(501, done);
      });
    });
  });
})