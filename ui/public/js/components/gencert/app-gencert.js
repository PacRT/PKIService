/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var GenCertStore = require('../../stores/app-gencert-store');
var GenCertActions = require('../../actions/app-gencert-actions');
var Table = require('react-bootstrap/lib/Table');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Button = require('react-bootstrap/lib/Button');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('react-bootstrap/lib/Input');
var FormGroup = require('react-bootstrap/lib/FormGroup');
var FormControl = require('react-bootstrap/lib/FormControls');
var ControlLabel = require('react-bootstrap/lib/ControlLabel');
var Tab = require('react-bootstrap/lib/Tab');
var Tabs = require('react-bootstrap/lib/Tabs');


var _ = require('underscore');

var GenCert = React.createClass({
   getInitialState: function(){
        return {
                  key: 1,
                  client_C: '',
                  client_O: '',
                  client_OU: '',
                  client_CN: '',
                  client_PA: 'pass:pass',
                  server_SAN: '',
                  server_C: '',
                  server_O: '',
                  server_OU: '',
                  server_CN: '',
                  server_PA: 'pass:pass'
        }
    },
    componentDidMount: function() {
        GenCertActions.getBasicClientConf()
        GenCertActions.getBasicServerConf()
        GenCertStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        GenCertStore.removeChangeListener(this._onChange);
    },
    _handleTextAreaChange : function(event){
        console.log(event.target.value)
        console.log(event.target.name)
        if ( event.target.name == "client_C") this.setState({ client_C  : event.target.value })
        if ( event.target.name == "client_O") this.setState({ client_O  : event.target.value })
        if ( event.target.name == "client_OU") this.setState({ client_OU  : event.target.value })
        if ( event.target.name == "client_CN") this.setState({ client_CN  : event.target.value })
        if ( event.target.name == "client_PA") this.setState({ client_PA  : event.target.value })
        if ( event.target.name == "server_SAN") this.setState({ server_SAN  : event.target.value })
        if ( event.target.name == "server_C") this.setState({ server_C  : event.target.value })
        if ( event.target.name == "server_O") this.setState({ server_O  : event.target.value })
        if ( event.target.name == "server_OU") this.setState({ server_OU  : event.target.value })
        if ( event.target.name == "server_CN") this.setState({ server_CN  : event.target.value })
        if ( event.target.name == "server_PA") this.setState({ server_PA  : event.target.value })
    },
    _handleServerCert : function(){
      var customInfo = { SAN: this.state.server_SAN,
                         C: this.state.server_C, 
                         O: this.state.server_O, 
                         OU: this.state.server_OU, 
                         CN: this.state.server_CN, 
                         PA: this.state.server_PA }
      GenCertActions.generateCertServer(customInfo);
    },
    _handleClientCert : function(){
      var customInfo = { C: this.state.client_C, 
                         O: this.state.client_O, 
                         OU: this.state.client_OU, 
                         CN: this.state.client_CN, 
                         PA: this.state.client_PA }
      GenCertActions.generateCertClient(customInfo);
    },
    _onChange: function() {
       var clintConf = GenCertStore.getClientConf();
       var serverConf = GenCertStore.getServerConf();
       if ( _.has(clintConf, "countryName" ))  { 
            console.log(" on change clintConf")
            console.log(clintConf)
            this.setState({
              client_C: clintConf["countryName"],
              client_O: clintConf["organizationName"],
              client_OU: clintConf["organizationalUnitName"],
              client_CN: clintConf["commonName"],

              server_SAN: this.state.server_SAN,
              server_C: this.state.server_C,
              server_O: this.state.server_O,
              server_OU: this.state.server_OU,
              server_CN: this.state.server_CN

            });  
        }
       if ( _.has(serverConf, "countryName" ))  { 
            console.log(" on change serverConf")
            console.log(serverConf)
            this.setState({
              client_C: this.state.client_C,
              client_O: this.state.client_O,
              client_OU: this.state.client_OU,
              client_CN: this.state.client_CN,

              server_SAN: serverConf["SAN"],
              server_C: serverConf["countryName"],
              server_O: serverConf["organizationName"],
              server_OU: serverConf["organizationalUnitName"],
              server_CN: serverConf["commonName"]
            });  
        }
    },
    handleSelect: function(key) {
      this.setState({key});
    },
    render: function () {
      var _this = this;

      if ( _this.state.client_C.length <= 0 && _this.state.server_C.length <=0)  {
        return (<div></div>) 
      }
      else {
        return (
               <div>

               <Tabs activeKey={this.state.key} onSelect={this.handleSelect} id="controlled-tab-example">
                <Tab eventKey={1} title="Server Certificate">
                 <br/>
                 <br/>
                  <Grid>
                   <Row> <Col xs={6} md={6}> <Input name='server_SAN' type="text" value={_this.state.server_SAN} onChange={this._handleTextAreaChange} label="SAN"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='server_C'  type="text" value={_this.state.server_C} onChange={this._handleTextAreaChange} label="Country"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='server_O'  type="text" value={_this.state.server_O} onChange={this._handleTextAreaChange} label="Organization"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='server_OU' type="text" value={_this.state.server_OU} onChange={this._handleTextAreaChange} label="Organization Unit"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='server_CN' type="text" value={_this.state.server_CN} onChange={this._handleTextAreaChange} label="Common Name"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='server_PA' type="text" defaultValue="pass:pass" onChange={this._handleTextAreaChange} label="Password"/> </Col> </Row>
                   <br/>
                   <Button onClick={this._handleServerCert}>Generate Certificate</Button>
                   <br/>
                  </Grid>
                 </Tab>

                 <Tab eventKey={2} title="Client Certificate">
                  <br/>
                  <br/>
                  <Grid>
                   <Row> <Col xs={6} md={6}> <Input name='client_C'  type="text" value={_this.state.client_C} onChange={this._handleTextAreaChange} label="Country"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='client_O'  type="text" value={_this.state.client_O} onChange={this._handleTextAreaChange} label="Organization"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='client_OU' type="text" value={_this.state.client_OU} onChange={this._handleTextAreaChange} label="Organization Unit"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='client_CN' type="text" value={_this.state.client_CN} onChange={this._handleTextAreaChange} label="Common Name"/> </Col> </Row>
                   <Row> <Col xs={6} md={6}> <Input name='client_PA' type="text" defaultValue="pass:pass" onChange={this._handleTextAreaChange} label="Password"/> </Col> </Row>
                  <br/>
                   <Button onClick={this._handleClientCert}>Generate Certificate</Button>
                  <br/>
                  </Grid>
                 </Tab>

                </Tabs>
              </div>
        )
      }
    }
});

module.exports = GenCert;
