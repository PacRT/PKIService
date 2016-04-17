/**
 * Created by Hardik on 1/14/16.
 */
var AppDispatcher = require('../dispatchers/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var ObjectAssign = require('object-assign');

var CHANGE_EVENT = "change";

var _notification = {
    autoHideDuration: 0,
    message: "Default Message",
    open: false
};

var NotificationStore  = ObjectAssign({},EventEmitter.prototype,{
    addChangeListener:function(cb){
        this.on(CHANGE_EVENT, cb);
    },
    removeChangeListener:function(cb){
        this.removeListener(CHANGE_EVENT, cb);
    },
    getNotification : function(){
        return _notification;
    }

});

AppDispatcher.register(function(payload){
    var action = payload.action;
    switch (action.actionType){
        case AppConstants.SHOW_NOTIFICATION:
            _notification.message = action.response.message || "Default Message";
            _notification.open = action.response.open;
            NotificationStore.emit(CHANGE_EVENT);
            break;
        default:
            return true;

    }
});

module.exports = NotificationStore;