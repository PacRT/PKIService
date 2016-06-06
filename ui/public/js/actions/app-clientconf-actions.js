/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var ClientConfActions = {
    getAdvClientConf:function(){
        //in use
        API.get(APIConstants.GET_ADV_CLIENT_CONF).then(function(response){
            var result = JSON.parse(response.text);
            AppDispatcher.handleViewAction({
                actionType: AppConstants.GET_ADV_CLIENT_CONF,
                response: result
            });
        });
    },
    saveClientConf:function(clientConf){
        //in use
        API.post(APIConstants.SAVE_CLIENT_CONF, clientConf).then(function(response){
            var result = response.text;
            console.log(result)
            var notification = {
                    open : true,
                    message : result
            };
            AppDispatcher.handleViewAction({
                actionType: AppConstants.SHOW_NOTIFICATION,
                response: notification
            });
        });
    }
}
module.exports = ClientConfActions;
