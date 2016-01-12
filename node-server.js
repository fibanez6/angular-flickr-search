/**
 * Created by fibanez on 25/10/15.
 */
'use strict';

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan'); // formerly express.logger
var errorhandler = require('errorhandler');
var compress = require('compression');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

// express/connect middleware
app.use(favicon(__dirname + '/flickrSearch/static/img/favicon.png'));
app.use(morgan('dev'));
app.use(compress());

// serve up static assets
app.use(express.static(path.join(__dirname, '')));

// development only
if ('development' === app.get('env')) {
    app.use(errorhandler());
}

http.createServer(app).listen(app.get('port'), function () {
    console.log('flickrApp server listening on port ' + app.get('port'));
});