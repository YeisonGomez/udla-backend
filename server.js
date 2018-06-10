var express = require('express');
bodyParser = require('body-parser'),
    cors = require('cors'),
    fs = require('fs'),
    mysql = require('mysql'),
    connection = require('express-myconnection'),
    config = require('./config'),
    multer = require('multer'),
    auth = require('./services/middleware_admin');

var server = express();
router = express.Router();

server.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.use(connection(mysql, config.db, 'request'));
server.use(bodyParser.json({ limit: '80mb' }));
server.use(bodyParser.urlencoded({ limit: '80mb', extended: true }));
server.use(cors())
server.use('/', require('./routes'));
server.use('/', express.static(__dirname + '/public/'));

server.listen(config.server.port, config.server.ip, function() {
    console.log(" run  " + config.server.ip + ':' + config.server.port);

});
