/**
 * Created by Hardik on 1/4/16.
 */
var React = require('react');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Input = require('../utils/Input.js');
var LoginActions = require('../../actions/app-login-actions');
var _ = require("underscore");

var Login = React.createClass({
    getInitialState: function(){
        return {
            userName : "Sudhakar",
            password : "Hadik"
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
    render: function () {
        return (
            <div>
                <Grid>
                    <Row className="show-grid" >
                        <Col xs={12} md={6} mdOffset={3}>
                           <center> <h1>Login</h1> </center>
                            <form auto-complete="off" onSubmit={this._handleSubmit} >
                                <Input
                                    text="User Name"
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
