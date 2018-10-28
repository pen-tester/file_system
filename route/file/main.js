var express = require('express');
var router = express.Router();
var md5 = require('md5');
var CRC = require('crc');
var path = require('path');

var global_area = require('../../config/global');  

var Util = require('../../utils/utils');
//System Codes for request, respond, some types
var System_Code = require('../../config/system_code');
var Config  = require('../../config/config');



 //Middleware for this router
 router.use(function origin_set (req,res, next){
     // console.log('Time: ', Date.now(), 'Requests: ', req);
     res.set("Access-Control-Allow-Credentials", true);
     res.set("Access-Control-Allow-Origin", "*");
     res.set("Access-Control-Allow-Methods", "POST, GET");
     res.set("Access-Control-Allow-Headers","Content-Type, Authorization, X-Requested-With, Origin");   
      next();
  });
 
 
  router.use(function authorization (req,res, next){
      // console.log('Time: ', Date.now(), 'Requests: ', req);
      next();
  });
 
 
 router.get("/image/:name", function(req,res){
    var name = req.params.name || '';
    console.log(name);
    if(name == ''){
        res.status(System_Code.http.bad_req);
        res.json({code:System_Code.responsecode.param_missing_error.code, data:'No parameters'});
        return;
    }

    var rel_path= path.join(__basedir,  '/../uploaded/'+name);


    res.sendfile(rel_path);
 });
 

 router.post("/upload", function(req,res){
    if (!req.files)
    return res.status(System_Code.http.bad_req).json({
        code:System_Code.responsecode.unknown.code,
        data:"Error occured while uploadding."                    
    });    

    var user = res.locals.user;
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var imagefile = req.files.image;
    //console.log(imagefile);

    //Checking the file extension and file capacity...
    if(imagefile.mimetype.indexOf("image") < 0){
        res.status(System_Code.http.bad_req);
        res.json({
            code:System_Code.responsecode.unknown.code,
            data:"File Type is incorrect. Only image file is allowed."
        })
        return;
    }

    if(imagefile.data.length > 10 *1024*1024){
        res.status(System_Code.http.bad_req);
        res.json({
            code:System_Code.responsecode.unknown.code,
            data:"File Size is exceeded. File size has to be less than 10M."
        })
        return;        
    }

    //console.log(listid, user);
    uploadfile(imagefile , user).then((result)=>{
        res.json({code:System_Code.responsecode.req_success.code,
            data:result       
        });
    }).catch((err)=>{
        res.status(System_Code.http.bad_req);
        res.json({
            code:System_Code.responsecode.unknown.code,
            data:"Error occured while writing the file",
            error:JSON.stringify(err)
        })
        console.log(err);
    });
});

async function uploadfile(imagefile, user){ 
    // Use the mv() method to place the file somewhere on your server
    var name = 'img'+Util.formatDate(new Date(), "yyyy_MM_dd_HH_mm_ss")+".jpg";
    var filepath = path.join(__basedir,  '/../uploaded/'+name);

    await imagefile.mv(filepath);
    //For sending notification...
    axios.post(Config.notification_url+"/notification/send" ,  
      {
        code:'uploadImaged',
        data:{
            path:name
        }
        , id:user.id}).then(result=>{}).catch(err=>{});

    return name;
}
 

module.exports = router;