/**
 * Created by Hardik on 2/6/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var APIURL = require('../utils/getAPIURL');
var ServerConfActions = {
    getAdvServerConf:function(){
        console.log("called getAdvServerConf")
        API.get(APIConstants.GET_ADV_SERVER_CONF).then(function(response){
            var result = JSON.parse(response.text);
            console.log(result)
            AppDispatcher.handleViewAction({
                actionType: AppConstants.GET_ADV_SERVER_CONF,
                response: result
            });
        });
    },
    saveServerConf:function(ServerConf){
        
        API.post(APIConstants.SAVE_SERVER_CONF, ServerConf).then(function(response){
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
module.exports = ServerConfActions;
