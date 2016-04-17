/**
 * Created by Hardik on 1/24/16.
 */
/** @jsx React.DOM */
var React = require('react');
var RaisedButton = require('material-ui/lib/raised-button');
var Snackbar = require('material-ui/lib/snackbar');
var NotificationStore = require('../../stores/app-notification-store');
var NotificationActions = require('../../actions/app-notification');

var Notification = React.createClass({
    getInitialState: function () {
        var notification = NotificationStore.getNotification();
        return {
            autoHideDuration: notification.autoHideDuration,
            message : notification.message,
            open : notification.open
        }
    },
    componentDidMount: function() {
        NotificationStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        NotificationStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        var notification = NotificationStore.getNotification();
        this.setState({
            autoHideDuration: notification.autoHideDuration,
            message : notification.message,
            open : notification.open
        });
    },
    handleRequestClose:function(){
        var notification = {
            open : false
        }
        NotificationActions.showNotification(notification);
    },
    handleTouchTap: function(){
        var notification = {
            open : true,
            message : "Custom Message"
        }
        NotificationActions.showNotification(notification);
    },
    render: function () {
        return (
            <div>
                <Snackbar
                    open={this.state.open}
                    message={this.state.message}
                    action="Ok"
                    autoHideDuration={this.state.autoHideDuration}
                    onRequestClose={this.handleRequestClose}
                    onActionTouchTap={this.handleRequestClose}
                />
            </div>
        );
    }
});

module.exports = Notification;



