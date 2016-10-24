var express = require('express');
bodyParser = require('body-parser'),
    cors = require('cors'),
    fs = require('fs'),
    mysql = require('mysql'),
    connection = require('express-myconnection'),
    config = require('./config'),
    auth = require('./services/middleware_admin');

var server = express();
router = express.Router();

server.use(connection(mysql, config.db, 'request'));
server.use(bodyParser.json({limit: '50mb'}));
server.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
server.use(cors())
server.use('/', require('./routes'));
server.use('/', express.static(__dirname + '/public/'));

server.listen(config.server.port, config.server.ip, function() {
    console.log(" run  " + config.server.ip + ':' + config.server.port);

});
