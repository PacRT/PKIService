/** @jsx React.DOM */
var React = require('react');
var Jumbotron  = require('react-bootstrap/lib/Jumbotron');
var RaisedButton = require('material-ui/lib/raised-button');
var Login = require('../auth/app-login.js')


var HomePage = React.createClass({
    render: function () {
        return (
            <div>
              <Login/>
            </div>
        );
    }
});

module.exports = HomePage;
