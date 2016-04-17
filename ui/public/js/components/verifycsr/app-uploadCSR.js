var React = require('react');
var Dropzone = require('react-dropzone');
var Col = require('react-bootstrap/lib/Col');
var Image = require('react-bootstrap/lib/Image');
var Grid = require('react-bootstrap/lib/Grid');
var Row = require('react-bootstrap/lib/Row');
var ProgressBar = require('react-bootstrap/lib/ProgressBar');
var Card = require('material-ui/lib/card/card');
var LinearProgress = require('material-ui/lib/linear-progress');
var CardHeader = require('material-ui/lib/card/card-header');
var RaisedButton = require('material-ui/lib/raised-button');

var VerifyCSRActions = require('../../actions/app-verifycsr-actions');

var UploadCSR = React.createClass({
    getInitialState:function() {
        return {
            category: "",
            files: [],
            super_request: {},
            textAreaCSR : ""
        }
    },
    componentDidMount: function() {

    },
    componentWillUnmount: function() {

    },
    _onChange: function() {
        this.setState({
            progress : 0
        });
    },
    handleChange:function(event, index, value){
        this.setState({
            "category" : value
        });
    },
    removeFile : function(index){
        var files = this.state.files;
        files.splice(index,1);
        this.setState({
            "files" : files
        });
    },
    onDrop: function (files) {
        console.log(files);
        var isFilePresent = this.state.files.length;
        var present_files = [];
        if(isFilePresent){
            present_files = this.state.files;
            files = present_files.concat(files);
        }
        this.setState({
            files: files
        });
    },
    updateProgress:function(percent){
        this.setState({
            progress : percent
        });
    },
    uploadFiles:function(){
        /**
         * upkoad Function:
         *
         * files
         * use case 1 : user is uplaoding file..call  'uploadCSRFile' function
         * user case 2 : user pastes the contetnt ..call uploadCST Text function : this.refs.csrText.value
         *
         */
        if(this.state.files.length)
            UploadzoneActions.uploadDocs(this.state.files[0],this.state.category);
        this.setState({
            files : [],
            progress : 0
        });
    },
    getStyles : function(){
      return {
          "verify_button": {
              "float": "right",
              "margin-top": "12px"
          }
      }
    },
    _handleTextAreaChange : function(event){
        this.setState({
            "textAreaCSR" : event.target.value
        });
    },
    verifyCSR : function(){
        var csr = {}
        csr["csr"] = _.has(this.refs,"csrTextArea")  ? this.refs.csrTextArea.innerHTML : this.refs.csrText.contentWindow.document.body.innerText;
        VerifyCSRActions.verifyCSR(csr)
    },
    cancelUpload:function(){
        this.setState({
            files:[],
            progress :0,
        })
    },
    render: function () {
        var cardheader_style = {
            "height" : "100px",
            "lineHeight" : "100px",
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
            "margin-bottom" : "20px"
        };
        var styles = this.getStyles();
        return (
            <div>
                <Grid>
                    <Row>
                        <Col xs={12} md={12}>
                            <Dropzone onDrop={this.onDrop} style={dropzone_style}>
                                <Card>
                                    <CardHeader
                                        style={cardheader_style}
                                        title="Upload CSR File"
                                    />
                                </Card>
                            </Dropzone>
                        </Col>

                      <div xs={12} md={9} style={{marginBottom:"20px"}}> <center>----- OR -----</center> </div>

                        <Col xs={12} md={9}>
                            { this.state.files.length > 0 ?
                             <iframe ref="csrText" id="csrText" src={this.state.files[0].preview} frameborder="0" height="400"
                             width="95%"></iframe> : <textarea ref="csrTextArea" onkeyup={this._handleTextAreaChange} onchange={this._handleTextAreaChange} rows="10" cols="160">
                             Paste CSR text here
                             </textarea>
                            }

                        </Col>

                    </Row>
                    <RaisedButton  label="Verify CSR" style={styles.verify_button} onTouchTap={this.verifyCSR}/>


                </Grid>
            </div>
        );
    }
});

module.exports = UploadCSR;
