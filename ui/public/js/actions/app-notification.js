/**
 * Created by Hardik on 1/25/16.
 */
/**
 * Created by Hardik on 1/19/16.
 */
/** @jsx React.DOM */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');

var AppNotificationActions = {
    showNotification : function(notification) {
        AppDispatcher.handleViewAction({
            actionType : AppConstants.SHOW_NOTIFICATION,
            response   : notification
        });
    }
}

module.exports = AppNotificationActions;