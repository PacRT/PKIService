/** @jsx React.DOM */
var React = require('react');


var ShowCerts = require('../showcerts/app-showcerts');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');

var Dashboard = React.createClass({
    render: function () {
        return (
            <div>
                <ShowCerts/>
            </div>
        );
    }
});

module.exports = Dashboard;
