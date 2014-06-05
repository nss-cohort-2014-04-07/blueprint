/* global describe, it, before, beforeEach */
/* jshint expr:true */

'use strict';

process.env.DBNAME = 'blueprint-test';

var expect = require('chai').expect;
var Mongo = require('mongodb');
var traceur = require('traceur');
var db = traceur.require(__dirname + '/../../helpers/db.js');
var factory = traceur.require(__dirname + '/../../helpers/factory.js');

var Floor;

describe('Floor', function(){
  before(function(done){
    db(function(){
      Floor = traceur.require(__dirname + '/../../../app/models/floor.js');
      done();
    });
  });

  describe('.create', function(){
    it('should create a location', function(done){
      done();
    });
  });
});
