/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var UploadCSR = require('./app-uploadCSR');

var _ = require('underscore');
var VerifyCSR = React.createClass({
    render: function () {
        return (
            <div>
                <UploadCSR/>
            </div>
        )

    }
});

module.exports = VerifyCSR;
