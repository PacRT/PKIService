/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var ShowCertsActions = {
    getShowCerts:function(){
        API.get(APIConstants.SHOW_CERTS).then(function(response){
            var result = JSON.parse(response.text);
            AppDispatcher.handleViewAction({
                actionType: AppConstants.SHOW_CERTS,
                response: result
            });

        });
    },
    revokeCerts:function(certs){
    	API.post(APIConstants.REVOKE_CERTS, certs).then(function(response){
            var result = JSON.parse(response.text);
            console.log(result)
            AppDispatcher.handleViewAction({
                actionType: AppConstants.REVOKE_CERTS,
                response: result
            });
        });
    }
}

module.exports = ShowCertsActions;