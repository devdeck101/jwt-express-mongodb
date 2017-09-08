var express = require('express');
var router = express.Router();
var db = require('../db');
//jwt 
var jwt = require('jsonwebtoken');
const config = require('../config');
var bcrypt = require('bcrypt');

const handleToken = (req, res, next) => {
  //if authenticated and valid token
  //return next
  //if not 401
  //[0] = Bearer ----  [1] = token
  let token = req.headers['authorization'].split(' ')[1];
  jwt.verify(token, config.JWT_KEY, (err, decode) => {
    if (!err) {
      next();
    } else {
      res.status(401).json({
        success: false,
        error: err
      });
    }
  })
}

/* GET users listing. */
router.post('/register', (req, res, next) => {
  const { username, email, password } = req.body.userData;

  const hash = bcrypt.hashSync(password, config.SALT_ROUNDS);

  const dataToInsert = {
    name: username,
    email,
    password: hash
  };

  const handler = (err, result) => {
    if (!err) {
      res.json({
        success: true,
        message: 'User registered.',
        data: result
      });
    } else {
      res.json({
        success: false,
        message: 'User not registered.',
        error: err
      });
    }

  }
  db.register(dataToInsert, handler);

});

router.post('/listusers', handleToken, (req, res, next) => {
  //need to be authenticated (verify the token)
  //return the list of users
  const handler = (err, result) => {
    if (!err && result != null) {
      result.toArray((err, users) => {
        if(!err){
          res.json({
            success: true,
            message: 'The list of users',
            data: users
          });
        }
      })
    } else {
      res.json({
        success: false,
        message: 'An error happened.',
        error: err
      });
    }
  }

  db.findAll(handler);

})

module.exports = router;
