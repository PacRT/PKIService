/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var ShowCertsStore = require('../../stores/app-showcerts-store');
var ShowCertsActions = require('../../actions/app-showcerts-actions');
var Table = require('react-bootstrap/lib/Table');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Button = require('react-bootstrap/lib/Button');

var _ = require('underscore');
var revocation_reasons = [
                          "Unspecified",
                          "KeyCompromise",
                          "CACompromise",
                          "AffiliationChanged",
                          "Superseded",
                          "CessationOfOperation",
                          "RemoveFromCRL"
                       ]
var ShowCerts = React.createClass({
   getInitialState: function(){
        return {
            "certs_url" : [],
            "selected_certs":[],
            "revocationresaon": "unspecified"
        }
    },
    componentDidMount: function() {
        ShowCertsActions.getShowCerts();
        ShowCertsStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ShowCertsStore.removeChangeListener(this._onChange);
    },
    _handleCheckClick : function(cert_index){
        var cert = this.state.certs_url[cert_index];
        var selected_certs = this.state.selected_certs;

        if(this.state.selected_certs.indexOf(cert["Subject"]) == -1)
            selected_certs.push(cert["Subject"]);
        else
            selected_certs.splice(this.state.selected_certs.indexOf(cert["Subject"]),1);
        this.setState({
            "selected_certs" : selected_certs
        });
    },
    _handleRevoke : function(event){
        var payload = { certpaths: this.state.selected_certs, revocationresaon: this.state.revocationresaon}
        ShowCertsActions.revokeCerts(payload);
        var certs_url = ShowCertsStore.getCertsURL();
        certs_url.map(function(cert){cert["checked"]=false})
        this.setState({
            certs_url : certs_url
        });
        var selected_certs = []
        this.setState({
            selected_certs : selected_certs
        });
        this.setState({
            revocationresaon : "unspecified"
        });
    },
    //_handleRevocationReason: function(event, index, value) {
    _handleRevocationReason: function(event) {
        console.log("_handleRevocationReason")
        console.log(event.target.value)
        this.setState({
            revocationresaon : event.target.value
        });
    },
    _onChange: function() {
        var certs_url = ShowCertsStore.getCertsURL();
        this.setState({
            certs_url : certs_url
        });
    },
    render: function () {
        var _this = this;
        var clearLeftPadding = {
            paddingLeft: "0px"
        }
        return (
                <div>
                <Table striped bordered condensed hover>
                <thead>
                    <th> Id     </th>
                    <th> Status </th>
                    <th> Subject </th>
                    <th> File Name </th>
                    <th> Expiry Date </th>
                    <th> </th>
                </thead>
                <tbody>     
                    {
                        this.state.certs_url.map(function(url,index){
                            return(
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{url["Status"]}</td>
                                    <td>{url["Subject"]}</td>
                                    <td>{url["File Name"]}</td>
                                    <td>{url["Expiry Date"]}</td>
                                    <td><input type="checkbox" checked={url["checked"]} onChange={_this._handleCheckClick.bind(null,index)}/></td>                                    
                                </tr>
                            )
                        })
                    }
                </tbody>
                </Table>
                <div className="col-md-6" style={clearLeftPadding}>
                    <div className="col-md-4" style={clearLeftPadding}>
                    <select className="form-control" value={this.state.revocationresaon} onChange={this._handleRevocationReason}> 
                      {
                        revocation_reasons.map(function(reason){
                          return (<option value={reason}>{reason}</option>)
                        }) 
                      }
                    </select>
                    </div>
                    <div className="col-md-2">
                        <Button onClick={this._handleRevoke}>Revoke</Button>
                    </div>
                    </div>
            </div>
        )
    }
});

module.exports = ShowCerts;
