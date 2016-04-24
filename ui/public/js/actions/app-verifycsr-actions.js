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
            var result = response.text;
            console.log(result);
            var notification = {
                    open : true,
                    message : result
            };
            AppDispatcher.handleViewAction({
                    actionType : AppConstants.SHOW_NOTIFICATION,
                    response : notification
            });
        });
    },
    signCSR:function(csrInfo){
        API.post(APIConstants.SIGN_CSR, csrInfo).then(function(response){
            var result = response.text;
            console.log(result);
            var sUrl = APIURL.get(APIConstants.CERT_DOWNLOAD.replace('#fname#', result))
            var link = document.createElement('a'); link.href = sUrl; 

            //Dispatching click event. 
            if (document.createEvent) { var e = document.createEvent('MouseEvents'); 
                                            e.initEvent('click' ,true ,true); 
                                            link.dispatchEvent(e); 
                                       }
            var notification = {
                    open : true,
                    message : "Successfully Generated Certificate"
                };
                AppDispatcher.handleViewAction({
                    actionType : AppConstants.SHOW_NOTIFICATION,
                    response : notification
                });
            /*API.get(APIConstants.CERT_DOWNLOAD.replace('#fname#', result)).then(function(response){
                var result = response.text;
                console.log(result);
            })*/
        });
    }
}

module.exports = VerifyCSRActions;
