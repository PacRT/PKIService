/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');

var UnderConstruction = React.createClass({

    render: function () {
        return (
            <div>
                    <center>
                        <h1>
                            <i className="fa fa-cog fa-3x fa-spin"></i>
                            <i className="fa fa-cog fa-2x fa-spin"></i>
                        </h1>
                    </center>
                    <center> <h1>Page Under Construction </h1> </center>
            </div>
        );
    }
});

module.exports = UnderConstruction;
