const con = require('../config/database');
const GLOBALS = require('../config/constants');
const jwt=require('jsonwebtoken')



const headerValidator = {

  
    validateHeaderApiKey: function (req, res, callback) {

        let apiBypassMethod = ["signup","login"];
        let path_data = req.path.split("/");
        if (apiBypassMethod.indexOf(path_data[4]) == -1) {
            let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
        
            try {
               
                const verified = jwt.verify(req.headers.token, jwtSecretKey);
                if (!verified) {
                    return res.status(401).send(error);

                } else{
                    callback();
                }
            } catch (error) {
                return res.status(401).send(error);
            }
     
        } else {
            callback();
        }
    },


    checkValidationRules: function (request, response, rules, messages, keywords) {

        let v = require('Validator').make(request, rules, messages, keywords);
        if (v.fails()) {
            let Validator_errors = v.getErrors();
            for (let key in Validator_errors) {
                error = Validator_errors[key][0];
                break;
            }
            response_data = {
                code: '0',
                message: error
            };
            response.status(400);
            response.json(response_data);
            return false;
        } else {
            return true;
        }
    },

    /**
     * Function to return response for any api
     * @param {Request Object} req 
     * @param {Response Object} res 
     * @param {Status code} statuscode 
     * @param {Response code} responsecode 
     * @param {Response Msg} responsemessage 
     * @param {Response Data} responsedata 
     */

    sendresponse: function (req, res, statuscode, responsecode, responsemessage, responsedata) {

        headerValidator.getMessage(req.lang, responsemessage.keyword, responsemessage.components, function (formedmsg) {
            if (responsedata != null) {
                let response_data = { code: responsecode, message: formedmsg, data: responsedata };
                    res.status(statuscode);
                    res.json(response_data);
               
            } else {
                let response_data = { code: responsecode, message: formedmsg };
                res.status(statuscode);
                res.json(response_data);
              
            }
        });
    },

   
    getMessage: function (requestLanguage, keywords, components, callback) {

     
        callback(keywords, components);
    },

}
module.exports = headerValidator;