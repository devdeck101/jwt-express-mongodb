var express = require('express');
var router = express.Router();
//config
const config = require('../config');
//jwt 
var jwt = require('jsonwebtoken');

var bcrypt = require('bcrypt');

var db = require('../db');


/**
 * Receive email and password
 * Find user
 * generate token
 */
router.post('/login', (req, res, next) => {
    console.log(req.body)
    const { email, password } = req.body.userData;

    if( email === undefined || password === undefined ){
        res.status(401).json({
            success: false,
            code: 'DD101_API_ERROR_01',
            message: "E-mail and/or password invalid."
        });
    } else {
        //find user in MongoDB

        const handler = (err, result) => {
            if(!err && result !== null && bcrypt.compareSync(password, result.password)){
                let tokenData = {
                    name: result.name,
                    email: result.email
                }
                let generatedToken = jwt.sign(tokenData, config.JWT_KEY, {  expiresIn: '1m'});
                res.json({
                    success: true,
                    token: generatedToken
                });
            } else {
                res.status(401).json({
                    success: false,
                    code: 'DD101_API_ERROR_02',
                    message: err || 'User does not exists.'
                });
            }
        }

        db.findUser({email}, handler);


    }
});

router.get('/verifytoken', (req, res, next) => {
    //[0] = Bearer ----  [1] = token
    let token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, config.JWT_KEY, (err, decode) => {
        if(!err){
            res.json({
                sucess: true,
                message: 'Token is valid.'
            });
        } else {
            res.status(401).json({
                success: false,
                error: err
            });
        }
    })
})


module.exports = router;