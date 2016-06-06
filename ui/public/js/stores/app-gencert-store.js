/**
 * Created by Hardik on 2/6/16.
 */
var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('object-assign');

var CHANGE_EVENT = "change";
var _clintConf = {};
var _serverConf = {};

var GenCertStore  = ObjectAssign({},EventEmitter.prototype,{
    addChangeListener:function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener:function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    getClientConf : function() {
        console.log("client store")
        console.log(_clintConf)
        return _clintConf;
    },  
    getServerConf : function() {
        console.log("server store")
        console.log(_serverConf)
        return _serverConf;
    }
});

AppDispatcher.register(function(payload){
    var action = payload.action;
    console.log(" main store action type")
    console.log(action.actionType)
    console.log(" main store response")
    console.log(action.response)
    switch (action.actionType){
        case AppConstants.BASIC_CLIENT_CONF: {
            _clintConf = action.response;
            console.log("switch client store")
            console.log(_clintConf)
            GenCertStore.emit(CHANGE_EVENT);
            break; 
        }
        case AppConstants.BASIC_SERVER_CONF: {
            _serverConf = action.response;
            console.log("switch server store")
            console.log(_serverConf)
            GenCertStore.emit(CHANGE_EVENT);
            break;
        }
        default:
            return true;

    }
});

module.exports = GenCertStore;