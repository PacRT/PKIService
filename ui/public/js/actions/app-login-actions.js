/**
 * Created by Hardik on 1/19/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var hashHistory = require('react-router').hashHistory;

var LoginActions = {
    loginUser:function(user_name,password){
        var data = {
            "user_name" : user_name,
            "password" : password
        }
        /*window.alert("inside login action : ")
        API.post(APIConstants.LOG_IN,data).then(function(response){
            var result = JSON.parse(response.text);
            AppDispatcher.handleViewAction({
                actionType : AppConstants.LOG_IN,
                response : {}
            });
            hashHistory.push('dashboard');
        });*/
       AppDispatcher.handleViewAction({
                actionType : AppConstants.LOG_IN,
                response : {}
            });
        hashHistory.push('dashboard');
    },
    continueSession:function(api_token,user_name){
        AppDispatcher.handleViewAction({
            actionType : AppConstants.LOG_IN,
            response :{"user_name":user_name,"api_token":api_token}
        });
        hashHistory.push('dashboard');
    },
    logoutUser:function(){
        AppDispatcher.handleViewAction({
            actionType : AppConstants.LOG_OUT,
        });
        hashHistory.push('');
    },
    addItem:function(){
        AppDispatcher.handleViewAction({
            actionType: AppConstants.ADD_ITEM
        })
    }
}

module.exports = LoginActions;