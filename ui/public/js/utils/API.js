/**
 * Created by Hardik on 1/12/16.
 */
// Random User API logic
var request       = require('superagent');
var API_URL = require('./getAPIURL');
var AppConstants = require('../constants/app-constants');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

module.exports = {

    get: function(api) {
        var api_url = API_URL.get(api);
        return new Promise(function (resolve, reject) {
            var super_request = request.get(api_url);
            if(api_url.indexOf('/login') == -1)
                super_request.set("API_TOKEN",localStorage.getItem(AppConstants.API_TOKEN));
                super_request.set("USER_NAME",localStorage.getItem(AppConstants.USER_NAME));
            super_request.set('Accept', 'application/json')
            super_request.end(function(err, response) {
                    if (err) reject();
                    resolve(response);
                });
        });

    },
    post : function(api,payLoad){
        var api_url = API_URL.get(api);
        return new Promise(function(resolve,reject){
            var super_request = request.post(api_url);
            if(api_url.indexOf('/login') == -1) {
                super_request.set("API_TOKEN",localStorage.getItem(AppConstants.API_TOKEN));
                super_request.set("USER_NAME",localStorage.getItem(AppConstants.USER_NAME));
            }
            super_request.set('Content-Type','application/json')
            super_request.send(payLoad)
            super_request.end(function(err, response){
              if(err) {
                var erroMsg = JSON.parse(response.text)["message"];
                var notification = {
                    open : true,
                    message : erroMsg
                };
                AppDispatcher.handleViewAction({
                    actionType : AppConstants.SHOW_NOTIFICATION,
                    response :notification
                });
                return reject(err);
              }
              resolve(response);
            })
        })
    },
    uploadFileRequest : function(api,files){
        var api_url = API_URL.get(api);
        var super_request = request.post(api_url);
        super_request.set("API_TOKEN",localStorage.getItem(AppConstants.API_TOKEN));
        super_request.set("USER_NAME",localStorage.getItem(AppConstants.USER_NAME));
        return super_request;
    },
    uploadDocs : function(files,api){


        return Promise.all(super_requests);

    }
};

