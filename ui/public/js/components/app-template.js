/** @jsx React.DOM */
var React = require('react');
var AppStore = require('../stores/app-store.js');
var AppActions = require('../actions/app-actions.js');

function getCart() {
  return AppStore.getCart();
}

var Template = 
    React.createClass({
        handleClick:function(){
            AppActions.addItem();
            console.log(getCart());
        },    
        render:function(){
            return (
            	<div>
                    {this.props.children}
                   { /* this button component uses view action dispatcher api  and it is using flux architecture */ }
                </div>
            	)
        }
	});



module.exports = Template;
