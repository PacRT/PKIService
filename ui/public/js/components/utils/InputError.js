/**
 * Created by Hardik on 1/9/16.
 */
/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');

var cx = require('classnames');

var InputError = React.createClass({

    getInitialState: function(){
        return {
            message: 'Input is invalid'
        };
    },

    render: function(){
        var errorClass = cx({
            'error_container':   true,
            'visible':           this.props.visible,
            'invisible':         !this.props.visible
        });

        return (
            <div className={errorClass}>
                <span>{this.props.errorMessage}</span>
            </div>
        )
    }

})

module.exports = InputError;