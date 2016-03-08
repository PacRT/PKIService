/**
 * Created by Hardik on 1/9/16.
 */
/** @jsx React.DOM */
var React = require('react');
var _ = require('underscore');
var Icon = require('./Icon.js');

var cx = require('classnames');

var UserNameValidator = React.createClass({

    getInitialState: function(){
        return {
            value: null,
            minCharacters: this.props.minCharacters,
            specialCharacters : this.props.specialCharacters,
            name: this.props.name
        };
    },

    render: function(){
        var validatorClass = cx({
            'password_validator':   true,
            'visible':              this.props.visible,
            'invisible':            !this.props.visible
        });

        var validatorTitle;

        if(this.props.valid) {
            validatorTitle =
                <h4 className="validator_title valid">
                    {this.props.name} IS OK
                </h4>
        } else {
            validatorTitle =
                <h4 className="validator_title invalid">
                    {this.props.name} RULES
                </h4>
        }
        return (
            <div className={validatorClass}>
                <div className="validator_container">

                    {validatorTitle}

                    <ul className="rules_list">

                        <li className={cx({'valid': this.props.validData.minChars})}>
                            <i className="icon_valid"> <Icon type="circle_tick_filled"/> </i>
                            <i className="icon_invalid"> <Icon type="circle_error"/> </i>
                            <span className="error_message">{this.state.minCharacters} characters minimum</span>
                        </li>

                        <li className={cx({'valid': this.props.validData.specialCharacters})}>
                            <i className="icon_valid"> <Icon type="circle_tick_filled"/> </i>
                            <i className="icon_invalid"> <Icon type="circle_error"/> </i>
                            <span className="error_message">Should contain only following special characters- dashes (-), underscores (_), and periods (.)</span>
                        </li>

                    </ul>
                </div>
            </div>
        )
    }
});

module.exports = UserNameValidator;