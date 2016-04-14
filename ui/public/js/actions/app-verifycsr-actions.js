/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var VerifyCSRActions = {
    /*getShowCerts:function(arg1){
        API.get(APIConstants.SHOW_CERTS).then(function(response){
            if(!_.isUndefined(arg1))
                console.log(response);
            var result = JSON.parse(response.text);
            AppDispatcher.handleViewAction({
                actionType: AppConstants.SHOW_CERTS,
                response: result
            });

        });
    },
    revokeCerts:function(certs){
        var _this = this
    	API.post(APIConstants.REVOKE_CERTS, certs).then(function(response){
            _this.getShowCerts("after deletinf certs")
        });
    }*/
}

module.exports = VerifyCSRActions;
