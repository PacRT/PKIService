/**
 * Created by Hardik on 12/22/15.
 */
/** @jsx React.DOM */
var React = require('react');
var RevokedCertsStore = require('../../stores/app-revokedcerts-store');
var RevokedCertsActions = require('../../actions/app-revokedcerts-actions');
var Table = require('react-bootstrap/lib/Table');
var selectedCerts = []
var _ = require('underscore');
var RevokedCerts = React.createClass({
   getInitialState: function(){
        return {
            "docs_url" : []
        }
    },
    componentDidMount: function() {
        RevokedCertsActions.getRevokedCerts();
        RevokedCertsStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        RevokedCertsStore.removeChangeListener(this._onChange);
    },
    _handleClick : function(event){
        //ExampleAction.updateMyDetails("Pacrt", "Developer");
        // get the list of certs that are selected 
    },
    _onChange: function() {
        var docs_url = RevokedCertsStore.getRevokedCerts();
        this.setState({
            docs_url : docs_url
        });
    },
    render: function () {
        var _this = this;
        return (
                <div>
                <Table striped bordered condensed hover>
                <thead>
                    <th> Id     </th>
                    <th> Subject </th>
                    <th> File Name </th>
                    <th> Expiry Date </th>
                    <th> Revoked Date </th>
                    <th> Revoked Reason </th>
                </thead>
                    <tbody>     
                    {
                        this.state.docs_url.map(function(url,index){
                            return(
                                <tr>
                                    <td>
                                    {index+1}
                                    </td>
                                    <td>
                                    {url["Subject"]}
                                    </td>
                                    <td>
                                    {url["File Name"]}
                                    </td>
                                    <td>
                                    {url["Expiry Date"]}
                                    </td>
                                    <td>
                                    {url["Revoked Date"]}
                                    </td>
                                    <td>
                                    {url["Revoked Reason"]}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </Table>
                <br/>
                <br/>
            </div>
        )
    }
});

module.exports = RevokedCerts;
