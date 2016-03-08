var render = require('react-dom').render;
var Router = require('react-router').Router;
var hashHistory = require('react-router').hashHistory;
_ = require('lodash');
/*var useRouterHistory = require('react-router').useRouterHistory;
var createHashHistory = require('history').createHashHistory;

//To Prevent random string appearing in react-router
var history = useRouterHistory(createHashHistory)({ queryKey: false });*/
var AppRouter = require('./components/app-router');

render(
    <Router history={hashHistory} routes={AppRouter} />,
    document.getElementById('tlsservice-app')
)

