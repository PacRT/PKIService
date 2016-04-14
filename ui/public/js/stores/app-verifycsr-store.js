/**
 * Created by Hardik on 2/6/16.
 */
var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('object-assign');

var CHANGE_EVENT = "change";

var _certs = [];

var VerifyCSRStore  = ObjectAssign({},EventEmitter.prototype,{
    addChangeListener:function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener:function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    }/*,
    getCertsURL : function() {
        return _certs;
    }*/
});

AppDispatcher.register(function(payload){
    var action = payload.action;
    switch (action.actionType){
        case AppConstants.SHOW_CERTS:
            _certs = action.response;
            VerifyCSRStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;

    }
});

module.exports = VerifyCSRStore;