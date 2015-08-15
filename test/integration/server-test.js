import {expect} from 'chai';
import supertest from 'supertest';
import app from '../../lib/app';

let api = supertest('http://localhost:3333');

describe('Server', () => {
  let server;
  before(done => {
    server = app.listen(3333, () => {
      done();
    });
  });

  after(() => {
    server.close();
  })

  it('Should return 400 on invalid JSON', done => {
    api.post('/users')
      .set('Content-Type', 'application/json')
      .send('{"username": "bubbles}')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.be.true;
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data.message).to.equal('Invalid JSON');
        done();
      });
  });
  describe('/', () => {
    describe('GET', () => {
      it('Should return 501 on /', done => {
        api.get('/')
          .expect(501, done);
      });
    });
    describe('POST', () => {
      it('Should return 501 on /', done => {
        api.post('/')
          .expect(501, done);
      });
    });
    describe('PUT', () => {
      it('Should return 501 on /', done => {
        api.put('/')
          .expect(501, done);
      });
    });
    describe('DELETE', () => {
      it('Should return 501 on /', done => {
        api.del('/')
          .expect(501, done);
      });
    });
  });
});
