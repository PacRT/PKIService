/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var ShowCertsStore = require('../../stores/app-showcerts-store');
var ShowCertsActions = require('../../actions/app-showcerts-actions');
var Table = require('react-bootstrap/lib/Table');
var selectedCerts = []
var _ = require('underscore');
var ShowCerts = React.createClass({
   getInitialState: function(){
        return {
            "certs_url" : [],
            "selected_certs":[]
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

        if(this.state.selected_certs.indexOf(cert["Cert Path"]) == -1)
            selected_certs.push(cert["Cert Path"]);
        else
            selected_certs.splice(this.state.selected_certs.indexOf(cert["Cert Path"]),1);
        this.setState({
            "selected_certs" : selected_certs
        });
    },
   /* _selectAll : function() {
        var certs_url = this.state.certs_url
        this.setState({
            "select_all" : !this.state.select_all
        })
        certs_url.map(function(url){
            url["isChecked"] = this.state.select_all
        })
        this.setState({
            certs_url : certs_url
        });
    },*/
    _handleClick : function(event){
        //ExampleAction.updateMyDetails("Pacrt", "Developer");
        // get the list of certs that are selected 
        console.log(this.state.selected_certs);
        ShowCertsActions.revokeCerts(this.state.selected_certs);
    },
    _onChange: function() {
        var certs_url = ShowCertsStore.getCertsURL();
        this.setState({
            certs_url : certs_url
        });
    },
    render: function () {
        var _this = this;
        return (
                <div>
                <Table striped bordered condensed hover>
                <thead>
                    <th> Id     </th>
                    <th> Issuer </th>
                    <th> Subject </th>
                    <th> Alternative Name </th>
                    <th> Issued Date </th>
                    <th> Expiry Date </th>
                    <th> </th>
                </thead>
                    <tbody>     
                    {
                        this.state.certs_url.map(function(url,index){
                            return(
                                <tr>
                                    <td>
                                    {index+1}
                                    </td>
                                    <td>
                                    {url["Issuer"]}
                                    </td>
                                    <td>
                                    {url["Subject"]}
                                    </td>
                                    <td>
                                    {url["Alternative Name"]}
                                    </td>
                                    <td>
                                    {url["Issued Date"]}
                                    </td>
                                    <td>
                                    {url["Expiry Date"]}
                                    </td>
                                    <td><input type="checkbox" onChange={_this._handleCheckClick.bind(null,index)}/></td>                                    
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
              <input type="button" value="Revoke" width="148" height="148" onClick={this._handleClick}/>
            </div>
        )
    }
});

module.exports = ShowCerts;
