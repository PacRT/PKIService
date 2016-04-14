/**
 * Created by Hardik on 4/13/16.
 */
var AppConstants = require('../constants/app-constants.js');
var AppDispatcher = require('../dispatchers/app-dispatcher.js');
var APIConstants = require('../constants/app-api-url.js');
var API = require('../utils/API.js');
var API_URL = require('../utils/getAPIURL');
var request = require('superagent-bluebird-promise');
var Promise = require('bluebird');

var UploadCSRActions = {
    /**
     * Upload CSR
     * @param files
     */
    uploadCSRFile : function(file){
        var api_url = API_URL.get(APIConstants.UPLOAD_CSR);
        /**
         * change api url for upload csr
         */
        var file_api_url = api_url.replace("#file_name#",file.name);
            var csr_upload_request = request
                .post(file_api_url)
                .attach(file.name, file)
                .on('progress', function(e) {
                    AppDispatcher.handleViewAction({
                        actionType: AppConstants.UPDATE_PROGRESS,
                        response: e.percent
                    });
                })
                .promise()
                .then(function(res){
                    return res;
                },function(err){
                    return { "err" : err.message};
                })
                .catch(function(err){
                    return { "err" :  err.message};
                });

        Promise
            .all(csr_upload_request)
            .then(function(res){
               console.log(res);
            },function(err){
                alert(err)
            })
            .catch(function(err){
                console.log(err);
            });
    },

    uploadCSRText : function(content){
        
    }
}

module.exports = UploadCSRActions;