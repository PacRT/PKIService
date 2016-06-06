/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var GenCertActions = {
    getBasicClientConf:function(){
        // In use
        API.get(APIConstants.GET_BASIC_CLIENT_CONF).then(function(response){
            var result = JSON.parse(response.text);
            console.log("actions client : "+AppConstants.BASIC_CLIENT_CONF)
            console.log(result)
            AppDispatcher.handleViewAction({
                actionType: AppConstants.BASIC_CLIENT_CONF,
                response: result
            });
        });
    },
    getBasicServerConf:function(){
        // In use
        API.get(APIConstants.GET_BASIC_SERVER_CONF).then(function(response){
            var result = JSON.parse(response.text);
            console.log("actions server : "+AppConstants.BASIC_SERVER_CONF)
            console.log(result)
            AppDispatcher.handleViewAction({
                actionType: AppConstants.BASIC_SERVER_CONF,
                response: result
            });
        });
    },
    generateCertServer:function(customInfo){
        // In use
        API.post(APIConstants.GEN_CERT_SERVER, customInfo).then(function(response){
            console.log(response)
            var result = response.text;
            console.log(result)
            //TODO validate results
            if ( result.indexOf("Error") >=0  )  { 
                var notification = {
                    open : true,
                    message : result
                };
                AppDispatcher.handleViewAction({
                   actionType: AppConstants.SHOW_NOTIFICATION,
                   response: notification
                }); 
            } 
            else { 
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
                actionType: AppConstants.SHOW_NOTIFICATION,
                response: notification
              });
           }
        });
    },
    generateCertClient:function(customInfo){
        // In use
        API.post(APIConstants.GEN_CERT_CLIENT, customInfo).then(function(response){
            console.log(response)
            var result = response.text;
            console.log(result)
            //TODO validate results
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
                actionType: AppConstants.SHOW_NOTIFICATION,
                response: notification
            });
        });
    }
}
module.exports = GenCertActions;
