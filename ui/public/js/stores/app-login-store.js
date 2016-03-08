/**
 * Created by Hardik on 2/4/16.
 */
var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('object-assign');
var _ = require("underscore");
var CHANGE_EVENT = "change";

var _login = {
    api_token: null,
    user_name: null
};

var LoginStore  = ObjectAssign({},EventEmitter.prototype,{
    addChangeListener:function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener:function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    getUser : function(){
        return _login.user_name;
    },
    getToken: function(){
        return _login.api_token;
    },
    isLoggedIn:function(){
       return !!_login.user_name;
    }
});

AppDispatcher.register(function(payload){
    var action = payload.action;
    switch (action.actionType){
        case AppConstants.LOG_IN:
            _login.api_token = action.response.api_token;
            _login.user_name = action.response.user_name;
            localStorage.setItem(AppConstants.API_TOKEN,_login.api_token);
            localStorage.setItem(AppConstants.USER_NAME,_login.user_name);
            LoginStore.emit(CHANGE_EVENT);
            break;
        case AppConstants.LOG_OUT:
            _login.api_token = null;
            _login.user_name = null;
            localStorage.removeItem(AppConstants.API_TOKEN);
            localStorage.removeItem(AppConstants.USER_NAME);
            LoginStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;

    }
});

module.exports = LoginStore;