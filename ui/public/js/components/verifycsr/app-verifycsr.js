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
                <h4>Verify CSR</h4>
                <UploadCSR/>
            </div>
        )

    }
});

module.exports = VerifyCSR;
