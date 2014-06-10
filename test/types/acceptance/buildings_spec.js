/* global describe, before, beforeEach, it */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');
var app = require('../../../app/app');
var request = require('supertest');

var User;

describe('floors', function(){

  before(function(done){
    db(function(){
      User = traceur.require(__dirname + '/../../../app/models/user.js');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.collection('users').drop(function(){
      factory('user', function(users){
        factory('location', function(locations){
          done();
        });
      });
    });
  });

  describe('Authentication', function(){
    var cookie;

    beforeEach(function(done){
      request(app)
      .post('/login')
      .send('email=sue@aol.com')
      .send('password=5678')
      .end(function(err, res){
        var cookies = res.headers['set-cookie'];
        var one = cookies[0].split(';')[0];
        var two = cookies[1].split(';')[0];
        cookie = one + '; ' + two;
        done();
      });
    });

    describe('GET /buildings/new', function(){
      it('should show the new buildings web page', function(done){
        request(app)
        .get('/buildings/new')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('sue@aol.com');
          expect(res.text).to.include('Mountain');
          expect(res.text).to.include('a123456789abcdef01234567');
          done();
        });
      });

      it('should NOT show the new buildings web page - not logged in', function(done){
        request(app)
        .get('/buildings/new')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('POST /buildings', function(){
      it('should create a new building', function(done){
        request(app)
        .post('/buildings')
        .set('cookie', cookie)
        .send('_id=bb23456789abcdef01234567')
        .send('name=mars')
        .send('x=100')
        .send('y=50')
        .send('locationId=a123456789abcdef01234567')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/buildings/bb23456789abcdef01234567');
          done();
        });
      });

      it('should NOT create a new building - not logged in', function(done){
        request(app)
        .post('/buildings')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });

    describe('GET /buildings/:id', function(){
      it('should show a building', function(done){
        request(app)
        .get('/buildings/c123456789abcdef01234567')
        .set('cookie', cookie)
        .end(function(err, res){
          expect(res.status).to.equal(200);
          expect(res.text).to.include('castle');
          expect(res.text).to.include('$105.00');
          done();
        });
      });

      it('should NOT show a building - not logged in', function(done){
        request(app)
        .get('/buildings/doesnotmatter')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          expect(res.headers.location).to.equal('/');
          done();
        });
      });
    });
  });

});
