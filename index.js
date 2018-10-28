#!/usr/bin/env node

//For http main process
var express = require('express');
var bodyParser = require("body-parser");
var path = require('path');
const fileUpload = require('express-fileupload');


//Routing....
var api_route=require('./route/api');


//Global part
var global_area = require('./config/global');

//Database...
var mongoose = require("mongoose");
//Config for the app
var config=require("./config/config");


const options = {
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0,
    useNewUrlParser: true
  };


mongoose.connect(config.mongodb_uri, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("mongodb is connected to db",config.mongodb_uri);
})
global.__basedir = __dirname;


var app=express();
//Set static files for js file..
app.use(express.static(path.join(__dirname, 'public')));
console.log(__dirname);
//Set view engine

app.use(bodyParser.json());  //support json encoded bodies
app.use(bodyParser.urlencoded({extended:true}));  //support encoded bodies

app.use(fileUpload());

//Routing...
app.use('/file', api_route);  // For the api...

app.all('/', function(req, res){
    res.redirect(config.company_url);
})

//App start...

var server = app.listen(config.port_number, function(){
        var host = server.address().address;
        var port = server.address().port;
        console.log("service server started ", host, ":", port);
});

