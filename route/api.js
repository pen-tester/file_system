var express = require('express');
var router = express.Router();
var md5 = require('md5');

var global_area = require('../config/global');  

var Util = require('../utils/utils');
//System Codes for request, respond, some types
var System_Code = require('../config/system_code');
var Config  = require('../config/config');


//For service api.......

//Sub route module
var file_route = require('./file/main');


//Middleware for this router
router.use(function origin_set (req,res, next){
    // console.log('Time: ', Date.now(), 'Requests: ', req);
    //console.log(req);

    if (req.method === 'OPTIONS') {
        //CORS sends the OPTION request first... So to enable this is important to work as API.
        console.log('!OPTIONS');
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With,Authorization, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {
        //...other requests
        res.set("Access-Control-Allow-Credentials", true);
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Access-Control-Allow-Methods", "POST, GET,OPTIONS");
        res.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Requested-With, Origin, OPTIONS");   
        res.set("Access-Control-Request-Headers","Content-Type, Authorization, X-Requested-With, Origin,OPTIONS");

        next();
    }
 });


//Middleware for this router
router.use(function authorization (req,res, next){
     // console.log('Time: ', Date.now(), 'Requests: ', req);
     next();
 });

 router.use('/', file_route);
 
module.exports = router;