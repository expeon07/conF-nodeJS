var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

const Users = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,function(req, res, next) {
  // res.send('respond with a resource');
  Users.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  })
});

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Context-Type', 'application/json');
      res.json({ err: err});
    } 
    else {
      if (req.body.firstname)
        user.firstname = req.body.firstname;
      if (req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Context-Type', 'application/json');
          res.json({ err: err });
          return;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Context-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      })
    }
  });
});

// authentication
// post because need to submit information
router.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res, next) => {
  // create jsonweb token
  var token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200;
  res.setHeader('Context-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
});

// use only get because no need to send any fundamental info
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

// use OAuth if user uses facebook to login
// use token if user logs in again
router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if (req.user) {
    // create jsonweb token
    var token = authenticate.getToken({_id: req.user._id})
    res.statusCode = 200;
    res.setHeader('Context-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
})

module.exports = router;
