/** @jsx React.DOM */
var React       = require('react');
var NavBar      = require('./navbar/app-navbar');
var Notification = require('./notification/app-notification');
var HomePage    = require('./home/app-home');
var injectTapEventPlugin = require("react-tap-event-plugin");

var APP = React.createClass({
    componentWillMount:function(){
        injectTapEventPlugin();
    },
    render: function () {
      var style={
          "marginTop":"50px"
      }
    return (
      <div>
        <NavBar />
        <div className="container" style={style}>
            {this.props.children || <HomePage/>}
             <Notification/>
        </div>
      </div>
    );
  }
});


exports.APP = APP;



