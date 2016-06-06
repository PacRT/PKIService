/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var ClientConfStore = require('../../stores/app-clientconf-store');
var ClientConfActions = require('../../actions/app-clientconf-actions');
var Table = require('react-bootstrap/lib/Table');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Button = require('react-bootstrap/lib/Button');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('react-bootstrap/lib/Input');

var _ = require('underscore');

var ClientConf = React.createClass({
   getInitialState: function(){
        return {
                  advClientTLSConf : {},
                  origadvClientTLSConf : {}
        }
    },
    componentDidMount: function() {
        console.log("inside componentDidMount")
        ClientConfActions.getAdvClientConf()
        ClientConfStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ClientConfStore.removeChangeListener(this._onChange);
    },
    _getAdvClientConf : function(){
        this.setState({
            advClientTLSConf : ClientConfActions.getAdvClientConf()
        });
    },
    _handleSave : function() {
      ClientConfActions.saveClientConf(this.state.advClientTLSConf)
    },
    _handleTextAreaValueChange : function(section, cItem, event){
        console.log(event)
        console.log("Sec: "+section+" , cItem: "+cItem)
        console.log(event.target.value)
        var clientTLSConf = this.state.advClientTLSConf
        var tempItems = []
        clientTLSConf[section].map(function(item,index){
           if (Object.keys(item)[0] == cItem) {
            item[Object.keys(item)[0]][0] = event.target.value
            console.log("item update ")
            console.log(item[Object.keys(item)[0]][0])
            tempItems.push(item)
           }
           else {
            tempItems.push(item)
           }
        })
        clientTLSConf[section] = tempItems
        this.setState({
            advClientTLSConf : clientTLSConf
        });
        console.log('finnal update event advClientTLSConf')
        console.log(this.state.advClientTLSConf)
    },
    _handleTextAreaCommentChange : function(section, cItem, event){
        console.log(event)
        console.log("Sec: "+section+" , cItem: "+cItem)
        console.log(event.target.value)
        var clientTLSConf = this.state.advClientTLSConf
        var tempItems = []
        clientTLSConf[section].map(function(item,index){
           if (Object.keys(item)[0] == cItem) {
            item[Object.keys(item)[0]][1] = event.target.value
            console.log("item update ")
            console.log(item[Object.keys(item)[0]][1])
            tempItems.push(item)
           }
           else {
            tempItems.push(item)
           }
        })
        clientTLSConf[section] = tempItems
        this.setState({
            advClientTLSConf : clientTLSConf
        });
        console.log('finnal update event advClientTLSConf')
        console.log(this.state.advClientTLSConf)
    },
    _onChange: function() {
        var clientTLSConf = ClientConfStore.getClientConf();
        console.log("_onChange")
        console.log(clientTLSConf)
        this.setState({
            advClientTLSConf : clientTLSConf
        });
    },
    render: function () {
        var _this = this
        console.log(this.state.advClientTLSConf)
        if ( !_.has(this.state.advClientTLSConf, "req" ))  { 
           return (<div></div>) 
        }
        return (
               <div>
                 <label>Request</label>
                 <Table striped bordered condensed hover>
                 <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advClientTLSConf['req'].map(function(cItem,index){
                            return(
                                <tr>
                                    <td>{Object.keys(cItem)[0]}</td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][0]} onChange={_this._handleTextAreaValueChange.bind(null, "req", Object.keys(cItem)[0])} /></td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][1]} onChange={_this._handleTextAreaCommentChange.bind(null, "req", Object.keys(cItem)[0])} /></td>
                                </tr>
                            )
                        })
                    }
                 </tbody>
                 </Table>
                 
                 <label>Client DN</label>
                 <Table striped bordered condensed hover>
                 <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advClientTLSConf['client_dn'].map(function(cItem,index){
                            return(
                                <tr>
                                    <td>{Object.keys(cItem)[0]}</td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][0]}  onChange={_this._handleTextAreaValueChange.bind(null, "client_dn", Object.keys(cItem)[0])}  /></td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][1]}  onChange={_this._handleTextAreaCommentChange.bind(null, "client_dn", Object.keys(cItem)[0])} /></td>
                                </tr>
                            )
                        })
                    }
                 </tbody>
                </Table>
                
                <label>Client Request</label>
                <Table striped bordered condensed hover>
                  <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advClientTLSConf['client_reqext'].map(function(cItem,index){
                            return(
                                <tr>
                                    <td>{Object.keys(cItem)[0]}</td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][0]} onChange={_this._handleTextAreaValueChange.bind(null, "client_reqext", Object.keys(cItem)[0])} /></td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][1]} onChange={_this._handleTextAreaCommentChange.bind(null, "client_reqext", Object.keys(cItem)[0])} /></td>
                                </tr>
                            )
                        })
                    }
                 </tbody>
                 </Table>
                    <Button onClick={this._handleSave}>Save</Button>
                 <br/>
                 <br/>
                 <br/>
                 <br/>
               </div>
        )
      
    }
});

module.exports = ClientConf;
