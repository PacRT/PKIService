/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var hashistory = require('react-router').hashistory;

var VerifyCSRActions = {
    verifyCSR:function(csrInfo){
        API.post(APIConstants.VERIFY_CSR, csrInfo).then(function(response){
            if(!_.isUndefined(csrInfo))
                console.log(response);
            var result = response.text;
            var notification = {
                    open : true,
                    message : result
                };
            AppDispatcher.handleViewAction({
                    actionType : AppConstants.SHOW_NOTIFICATION,
                    response : notification
            });
            AppDispatcher.handleViewAction({
                actionType: AppConstants.VERIFY_CSR,
                response: result
            });
            hashistory.push("verifycsr");
        });
    }/*
    revokeCerts:function(certs){
        var _this = this
    	API.post(APIConstants.REVOKE_CERTS, certs).then(function(response){
            _this.getShowCerts("after deletinf certs")
        });
    }*/
}

module.exports = VerifyCSRActions;
