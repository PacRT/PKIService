/**
 * Created by Hardik on 12/23/15.
 */


//Importing App Components
var APP         = require('./app').APP;
var ShowCerts      = require('./showcerts/app-showcerts');
var VerifyCSR      = require('./verifycsr/app-verifycsr');
var RevokedCerts= require('./revokedcerts/app-revokedcerts');


var Login       = require('./auth/app-login');

var DashBoard  = require('./dashboard/app-dashboard');
var LoginStore  = require('../stores/app-login-store');
var LoginActions = require('../actions/app-login-actions');
var AppConstants = require('../constants/app-constants');

/**
 * middleware to check if user is logged in or not.
 * @param nextState
 * @param replace
 */
function requireAuth(nextState, replace) {
    if (!LoginStore.isLoggedIn()) {
        replace({
            pathname: '/login',
            state: { nextPathname: nextState.location.pathname }
        })
    }
}

var AppRouter = {
    path: '/',
    component: APP,
    childRoutes: [

        { path : "login"        ,component: Login},
        { path : 'dashboard'    ,component:DashBoard   ,onEnter:requireAuth},

        { path : "showcerts"       ,component: ShowCerts      ,onEnter:requireAuth},
        { path : "verifycsr"       ,component: VerifyCSR      ,onEnter:requireAuth},
        { path : "revokedcerts" ,component: RevokedCerts ,onEnter:requireAuth}

    ]
};

var api_token = localStorage.getItem(AppConstants.API_TOKEN);
var user_name = localStorage.getItem(AppConstants.USER_NAME);
if(api_token && user_name)
    LoginActions.continueSession(api_token,user_name);
module.exports = AppRouter