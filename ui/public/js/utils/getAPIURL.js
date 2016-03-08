/**
 * Created by Hardik on 1/16/16.
 */
var HOST = "localhost";
var PORT = 4000;
var APIConstants = require('../constants/app-api-url.js');

module.exports = {
    get : function(API){
        return "http://" + HOST + ":" + PORT + APIConstants.API_PREFIX + API ;
    }
}