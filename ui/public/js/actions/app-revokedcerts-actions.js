/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var RevokedCertsActions = {
    getRevokedCerts:function(){
        API.get(APIConstants.REVOKED_CERTS).then(function(response){
            var result = JSON.parse(response.text);
            AppDispatcher.handleViewAction({
                actionType: AppConstants.REVOKED_CERTS,
                response: result
            });

        });
    }
}

module.exports = RevokedCertsActions;
