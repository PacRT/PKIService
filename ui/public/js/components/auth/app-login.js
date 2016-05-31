/**
 * Created by Hardik on 1/4/16.
 */
var React = require('react');
var Dropzone = require('react-dropzone');
var Card = require('material-ui/lib/card/card');
var CardHeader = require('material-ui/lib/card/card-header');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('../utils/Input.js');
var LoginActions = require('../../actions/app-login-actions');
var _ = require("underscore");

var Login = React.createClass({
    getInitialState: function(){
        return {
            userName : "key",
            password : "*****"
        }
    },
    handleUserNameInput : function(event){
        this.setState({
            userName : event.target.value
        });
    },
    handlePasswordInput : function(event){
        this.setState({
            password : event.target.value
        });
    },
    isEmpty: function (value) {
        return !_.isNull(value);
    },
    _handleSubmit: function(event){

        var can_login =!_.isNull(this.state.userName) && !_.isNull(this.state.password)
        if(can_login){
            LoginActions.loginUser(this.state.userName,this.state.password);
        }else{
            this.refs.userName.isValid();
            this.refs.password.isValid();
        }
    },
    getStyles : function(){
      return {
          "verify_button": {
              "float": "right",
              "margin-top": "12px"
          }
      }
    },
    render: function () {
        var cardheader_style = {
            "height" : "75px",
            "lineHeight" : "75px",
            "display"  : "block",
            "textAlign" : "center",
            "verticalAlign" : "middle",
            "padding" : "0px"
        };
        var dropzone_style={
            "borderWidth" : "0px",
            "borderColor" : "none",
            "borderStyle" : "none",
            "borderRadius" : "0px",
            "margin-bottom" : "15px"
        };
        return (
            <div>
                <Grid>
                    <Row className="show-grid" >
                        <Col xs={12} md={6} mdOffset={3}>
                           <center> <h1>Login</h1> </center>
                            <form auto-complete="off" onSubmit={this._handleSubmit} >
                                <Dropzone onDrop={this.onDrop} style={dropzone_style}>
                                <Card>
                                    <CardHeader
                                        style={cardheader_style}
                                        title="Upload Certificate File"
                                    />
                                </Card>
                                </Dropzone>
                                <Input
                                    text="Public Key"
                                    ref="userName"
                                    type="text"
                                    validate={this.isEmpty}
                                    value={this.state.userName}
                                    defaultValue={this.state.userName}
                                    onChange={this.handleUserNameInput}
                                    emptyMessage="User Name can't be empty"
                                />
                                <Input
                                    text="Private Key"
                                    ref="userName"
                                    type="text"
                                    validate={this.isEmpty}
                                    value={this.state.userName}
                                    defaultValue={this.state.userName}
                                    onChange={this.handleUserNameInput}
                                    emptyMessage="User Name can't be empty"
                                />
                                <Input
                                    text="Password"
                                    type="password"
                                    ref="password"
                                    validate={this.isEmpty}
                                    value={this.state.password}
                                    defaultValue={this.state.password}
                                    onChange={this.handlePasswordInput}
                                    emptyMessage="Password can't be empty"
                                />
                                <button
                                    type="submit"
                                    className="button button_wide">
                                    Log In
                                </button>
                            </form>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
});

module.exports = Login;
