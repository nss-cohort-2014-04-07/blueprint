'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');

exports.new = (req, res)=>{
  res.render('users/new', {title: 'Login'});
};

exports.create = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/login');
    }
  });
};

exports.login = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/login');
    }
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.redirect('/');
};
