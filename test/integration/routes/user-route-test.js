import {expect} from 'chai';
import supertest from 'supertest';
import app from '../../../lib/app';
import db from '../../../lib/db';
import _ from 'lodash';

let api = supertest('localhost:3333');

describe('User Routes', () => {
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

  describe('/users', () => {
    describe('GET', () => {
      it('Should return 200 with JSON', done => {
        api.get('/users')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

      it('Should return all users', done => {
        api.get('/users')
          .end((err, res)=> {
            expect(res.statusCode).to.equal(200);
            expect(res.body.data).to.have.lengthOf(3);
            done();
          });
      });

      it('Should return a set of objects', done => {
        api.get('/users')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.anArray;
            expect(res.body.data[0]).to.be.an('object');
            done();
          });
      });

      it('Should return all user data except password', done => {
        api.get('/users')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body.data[0]).to.have.property('id');
            expect(res.body.data[0].id).to.equal(1, 'id should be a number');
            expect(res.body.data[0]).to.have.property('username');
            expect(res.body.data[0].username).to.equal('billybob');
            expect(res.body.data[0]).to.have.property('email');
            expect(res.body.data[0].email).to.equal('someone@something.com');
            expect(res.body.data[0]).to.not.have.property('password');
            done();
          });
      });
    });
    describe('POST', () => {
      it('Should return 400 with validation errors', done => {
        api.post('/users')
          .expect('Content-type', /json/)
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.true;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.be.an('object');
            expect(res.body.data.message).to.have.property('username');
            expect(res.body.data.message.username).to.be.an('array');
            expect(res.body.data.message.username[0]).to.equal('The username is required');
            expect(res.body.data.message).to.have.property('email');
            expect(res.body.data.message.email).to.be.an('array');
            expect(res.body.data.message.email[0]).to.equal('The email is required');
            expect(res.body.data.message).to.have.property('password');
            expect(res.body.data.message.password).to.be.an('array');
            expect(res.body.data.message.password[0]).to.equal('The password is required');
            done();
          });
      });
      it('Should return an ID', function(done) {
        this.test.timeout(10000);
        api.post('/users')
          .send({username: 'george', password: 'blathargah', email: 'user@something.com'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.false;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('id');
            expect(res.body.data.id).to.equal(4);
            done();
          });
      });
    });
    describe('PUT', () => {
      it('Should return 501', done => {
        api.put('/users')
          .expect(501, done);
      });
    });
    describe('DELETE', () => {
      it('Should return 501', done => {
        api.del('/users')
          .expect(501, done);
      });
    });
  });
  describe('/users/:id', () => {
    describe('GET', () => {
      it('Should return 400 on invalid ID', done => {
        api.get('/users/21')
          .expect('Content-Type', /json/)
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.true;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.equal('Invalid ID');
            done()
          });
      })
      it('Should return 200 with JSON', done => {
        api.get('/users/1')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
      it('Should return all user information except password', done => {
        api.get('/users/1')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.false;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('id');
            expect(res.body.data.id).to.equal(1);
            expect(res.body.data).to.have.property('username');
            expect(res.body.data.username).to.equal('billybob');
            expect(res.body.data).to.have.property('email');
            expect(res.body.data.email).to.equal('someone@something.com');
            expect(res.body.data).to.not.have.property('password');
            done();
          });
      });
    });
    describe('POST', () => {
      it('Should return 501', done => {
        api.post('/users/1')
          .expect(501, done);
      });
    });
    describe('PUT', () => {
      it('Should return 400 with validation errors', done => {
        api.put('/users/1')
          .send({email: 'blah@hardgh'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.true;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.have.property('email');
            expect(res.body.data.message.email).to.be.an('array');
            expect(res.body.data.message.email[0]).to.equal('The email must be a valid email address');
            done();
          });
      });
      it('Should update the user', done => {
        api.put('/users/1')
          .send({username: 'bluf'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.false;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.equal('User updated successfully');
            api.get('/users/1')
              .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body.data.username).to.equal('bluf');
                done();
              });
          });
      });
    });
    describe('DELETE', () => {
      it('Should return 400 if user doesn\'t exist', done => {
        api.del('/users/4')
          .expect(400)
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.true;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.equal('Invalid ID');
            done();
          });
      });
      it('Should delete the user', done => {
        api.del('/users/1')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.be.false;
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have.property('message');
            expect(res.body.data.message).to.equal('User deleted successfully');
            api.get('/users/1')
              .expect(400)
              .end((err, res) => {
                expect(res.body.data.message).to.equal('Invalid ID');
                done();
              });
          });
      });
    });
  });
});