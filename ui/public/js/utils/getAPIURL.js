/**
 * Created by Hardik on 1/16/16.
 */
var HOST = "localhost";
var PORT = 4000;
var APIConstants = require('../constants/app-api-url.js');

var SPORT = 4443;

module.exports = {
    get : function(API){
        return "http://" + HOST + ":" + PORT + APIConstants.API_PREFIX + API ;
    },
    sget : function(API){
        return "https://" + HOST + ":" + SPORT + APIConstants.API_PREFIX + API ;
    }
}