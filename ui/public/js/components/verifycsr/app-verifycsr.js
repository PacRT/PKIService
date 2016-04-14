/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var VerifyCSRStore = require('../../stores/app-verifycsr-store');
var VerifyCSRActions = require('../../actions/app-verifycsr-actions');
var Table = require('react-bootstrap/lib/Table');
var DropDownMenu = require('material-ui/lib/DropDownMenu');
var MenuItem = require('material-ui/lib/menus/menu-item');
var Button = require('react-bootstrap/lib/Button');
var uploadCSR = require('./app-uploadzone');

var _ = require('underscore');
/*var revocation_reasons = [
                          "Unspecified",
                          "KeyCompromise",
                          "CACompromise",
                          "AffiliationChanged",
                          "Superseded",
                          "CessationOfOperation",
                          "RemoveFromCRL"
                       ]*/
var VerifyCSR = React.createClass({
   getInitialState: function(){
        return {

        }
    },
    componentDidMount: function() {
       // VerifyCSRActions.getVerifyCSR();
        VerifyCSRStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        VerifyCSRStore.removeChangeListener(this._onChange);
    },
    /*_handleCheckClick : function(cert_index){
        var cert = this.state.certs_url[cert_index];
        var selected_certs = this.state.selected_certs;

        if(this.state.selected_certs.indexOf(cert["Cert Path"]) == -1)
            selected_certs.push(cert["Cert Path"]);
        else
            selected_certs.splice(this.state.selected_certs.indexOf(cert["Cert Path"]),1);
        this.setState({
            "selected_certs" : selected_certs
        });
    },
    _handleRevoke : function(event){
        var payload = { certpaths: this.state.selected_certs, revocationresaon: this.state.revocationresaon}
        VerifyCSRActions.revokeCerts(payload);
        var certs_url = VerifyCSRStore.getCertsURL();
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
    },*/
    _onChange: function() {
        /*var certs_url = VerifyCSRStore.getCertsURL();
        this.setState({
            certs_url : certs_url
        });*/
    },
    render: function () {
        var _this = this;
        var clearLeftPadding = {
            paddingLeft: "0px"
        }
        return (
            <div>
                <uploadCSR/>
            </div>
        )
    }
});

module.exports = VerifyCSR;
