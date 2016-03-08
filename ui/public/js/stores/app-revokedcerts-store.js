/**
 * Created by Hardik on 2/6/16.
 */
var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('object-assign');

var CHANGE_EVENT = "change";

var _revokedCerts = [];

var RevokedCertsStore  = ObjectAssign({},EventEmitter.prototype,{
    addChangeListener:function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener:function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    getRevokedCerts : function() {
        return _revokedCerts;
    }
});

AppDispatcher.register(function(payload){
    var action = payload.action;
    switch (action.actionType){
        case AppConstants.REVOKED_CERTS:
            _revokedCerts = action.response;
            RevokedCertsStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;

    }
});

module.exports = RevokedCertsStore;