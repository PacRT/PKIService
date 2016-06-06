/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var ServerConfStore = require('../../stores/app-serverconf-store');
var ServerConfActions = require('../../actions/app-serverconf-actions');
var Table = require('react-bootstrap/lib/Table');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Button = require('react-bootstrap/lib/Button');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('react-bootstrap/lib/Input');

var _ = require('underscore');

var ServerConf = React.createClass({
   getInitialState: function(){
        return {
                  advServerTLSConf : {},
                  origadvServerTLSConf : {}
        }
    },
    componentDidMount: function() {
        console.log("inside componentDidMount")
        ServerConfActions.getAdvServerConf()
        ServerConfStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ServerConfStore.removeChangeListener(this._onChange);
    },
    _getAdvServerConf : function(){
        this.setState({
            advServerTLSConf : ServerConfActions.getAdvServerConf()
        });
    },
    _handleSave : function() {
      ServerConfActions.saveServerConf(this.state.advServerTLSConf)
    },
    _handleTextAreaValueChange : function(section, cItem, event){
        console.log(event)
        console.log("Sec: "+section+" , cItem: "+cItem)
        console.log(event.target.value)
        var serverTLSConf = this.state.advServerTLSConf
        var tempItems = []
        serverTLSConf[section].map(function(item,index){
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
        serverTLSConf[section] = tempItems
        this.setState({
            advServerTLSConf : serverTLSConf
        });
        console.log('finnal update event advServerTLSConf')
        console.log(this.state.advServerTLSConf)
    },
    _handleTextAreaCommentChange : function(section, cItem, event){
        console.log(event)
        console.log("Sec: "+section+" , cItem: "+cItem)
        console.log(event.target.value)
        var serverTLSConf = this.state.advServerTLSConf
        var tempItems = []
        serverTLSConf[section].map(function(item,index){
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
        serverTLSConf[section] = tempItems
        this.setState({
            advServerTLSConf : serverTLSConf
        });
        console.log('finnal update event advServerTLSConf')
        console.log(this.state.advServerTLSConf)
    },
    _onChange: function() {
        var serverTLSConf = ServerConfStore.getServerConf();
        console.log("_onChange")
        console.log(serverTLSConf)
        this.setState({
            advServerTLSConf : serverTLSConf
        });
    },
    render: function () {
        var _this = this
        console.log(this.state.advServerTLSConf)
        if ( !_.has(this.state.advServerTLSConf, "req" ))  { 
           return (<div></div>) 
        }
        return (
               <div>
                 <label>Default</label>
                 <Table striped bordered condensed hover>
                 <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advServerTLSConf['default'].map(function(cItem,index){
                            return(
                                <tr>
                                    <td>{Object.keys(cItem)[0]}</td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][0]} onChange={_this._handleTextAreaValueChange.bind(null, "default", Object.keys(cItem)[0])} /></td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][1]} onChange={_this._handleTextAreaCommentChange.bind(null, "default", Object.keys(cItem)[0])} /></td>
                                </tr>
                            )
                        })
                    }
                 </tbody>
                 </Table>

                 <label>Request</label>
                 <Table striped bordered condensed hover>
                 <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advServerTLSConf['req'].map(function(cItem,index){
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
                 
                 <label>Server DN</label>
                 <Table striped bordered condensed hover>
                 <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advServerTLSConf['server_dn'].map(function(cItem,index){
                            return(
                                <tr>
                                    <td>{Object.keys(cItem)[0]}</td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][0]}  onChange={_this._handleTextAreaValueChange.bind(null, "server_dn", Object.keys(cItem)[0])}  /></td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][1]}  onChange={_this._handleTextAreaCommentChange.bind(null, "server_dn", Object.keys(cItem)[0])} /></td>
                                </tr>
                            )
                        })
                    }
                 </tbody>
                </Table>
                
                <label>Server Request</label>
                <Table striped bordered condensed hover>
                  <thead>
                    <th> Name   </th>
                    <th> Value </th>
                    <th> Comment </th>
                 </thead>
                 <tbody>     
                    {
                        this.state.advServerTLSConf['server_reqext'].map(function(cItem,index){
                            return(
                                <tr>
                                    <td>{Object.keys(cItem)[0]}</td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][0]} onChange={_this._handleTextAreaValueChange.bind(null, "server_reqext", Object.keys(cItem)[0])} /></td>
                                    <td><input type="textbox" defaultValue={cItem[Object.keys(cItem)[0]][1]} onChange={_this._handleTextAreaCommentChange.bind(null, "server_reqext", Object.keys(cItem)[0])} /></td>
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

module.exports = ServerConf;
