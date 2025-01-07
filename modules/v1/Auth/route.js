const express = require('express');
const router = express.Router();
const middleWare = require('../../../middleware/headerValidator');
const user_model = require('./auth_model');
const common = require('../../../config/common');
const jwt = require('jsonwebtoken');



/*------------- SIGN UP -------------*/
router.post('/signup', (req, res) => {
    let request = req.body;


    let secret_key = process.env.JWT_SECRET_KEY;
    let payload = {
        email: request.email
    }
    let json_web_token = jwt.sign(payload, secret_key, {
        expiresIn: '5m'
    });

    request.token = json_web_token;

    user_model.signup(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });


});

/*------------- verify email templete -------------*/

router.get('/verify_email/:id/:token', (req, res) => {

    let user_id = req.params.id;
    let token = req.params.token;

    let secret_key = process.env.JWT_SECRET_KEY;
    try {
        jwt.verify(token, secret_key);
        user_model.getUserDetails(user_id, (userdetails) => {
            if (req.query.verify_type == 'after_edit') {
                common.singleUpdate('user', {
                    email: userdetails.new_email,
                    new_email: ''
                }, `id = '${user_id}'`, (result, error) => {
                    req.body.user_type = 'user';
                    common.generateSessionCode(user_id, req.body, (token) => {
                        res.render('emailverified.html');
                    });
                });
            } else {
                if (userdetails.signup_step == 'profile_set') {
                    res.render('emailverified.html');
                } else {
                    common.singleUpdate('user', {
                        signup_step: 'verified'
                    }, `id = '${user_id}'`, (result, error) => {
                        if (result.affectedRows > 0) {
                            res.render('verifyemail.html');
                        } else {
                            res.render('verifylinkexpired.html');
                        }
                    })
                }
            }
        });
    } catch (error) {
        console.log(error.message);
        res.render('verifylinkexpired.html');
    }

});



/*------------- LOGIN -------------*/
router.post('/login', (req, res) => {
    let request = req.body;
    let secret_key = process.env.JWT_SECRET_KEY;
    let payload = {
        email: request.email
    }
    let json_web_token = jwt.sign(payload, secret_key, {
        expiresIn: '1h'
    });
    request.token = json_web_token;
    user_model.login(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });



});

/*------------- getcategory -------------*/
router.post('/getcategory', (req, res) => {
    let request = req.body;

    user_model.getcategory(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });



});
/*------------- getcategory -------------*/
router.post('/addbook', (req, res) => {
    let request = req.body;

    user_model.addbook(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });



});
/*------------- deletebook -------------*/
router.post('/deletebook', (req, res) => {
    let request = req.body;

    user_model.deletebook(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });



});
/*------------- updatebook -------------*/
router.post('/updatebook', (req, res) => {
    let request = req.body;

    user_model.updatebook(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });



});
/*------------- getbooklist -------------*/
router.post('/getbooklist', (req, res) => {
    let request = req.body;

    user_model.getbooklist(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });



});
/*------------- add comment -------------*/
router.post('/addcomment', (req, res) => {
    let request = req.body;
    user_model.addcomment(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });

});
/*------------- add rating -------------*/
router.post('/addrating', (req, res) => {
    let request = req.body;
    user_model.addrating(request, (responsecode, message, data) => {
        middleWare.sendresponse(req, res, 200, responsecode, message, data);
    });

});
module.exports = router;