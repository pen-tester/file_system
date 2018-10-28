var md5 = require('md5');
var CRC = require('crc');

var global_area = require('../../config/global');  

var Util = require('../../utils/utils');
//System Codes for request, respond, some types
var System_Code = require('../../config/system_code');
var Config  = require('../../config/config');
var axios = require('axios');

//User DB...
var ContactModel = require('../../models/contact');
var ContactInfoModel = require('../../models/contactinfo');
var ContactListModel = require('../../models/contactlist');
var UserModel = require('../../models/users');
var CampaignModel = require('../../models/campaign');
var RecentMsgModel = require('../../models/recent_message');

//twilio controller
var twilio_controller = require('./twilio');
 
 sms_controller = {
    async process_receive_sms(from, to , body){
        //console.log(from, to, body);
        var user = await UserModel.findOne({'phone.outgoing.phone':to}).exec();
        var contacts = await ContactInfoModel.find({
            phone:from, userid:user.id
        }).sort({added:-1}).limit(1).lean().exec();
        //console.log(contact.id);
        if(contacts == null || contacts.length ==0) return -1;
        var contactinfo = contacts[0];
        var timestampe = Date.now();
        var message_id = "mg" + Math.floor((1 + Math.random())* 1000).toString(10).substring(1) + timestampe;  
        var chat = { 
            type: 1,
            content: body,
            fromNumber: from,
            toNumber: to,
            userid: user.id ,
            id: message_id,
            created:timestampe
        };
        //console.log(chat, user);
        ContactInfoModel.updateOne({id:contactinfo.id}, {
            $push: {
                chat: {
                   $each: [ chat ],
                   $position: 0
                }
            }
        }).exec();

        
        if(contactinfo.chat == null || contactinfo.chat == undefined ) contactinfo.chat = [];
        if(contactinfo.voice == null || contactinfo.voice == undefined ) contactinfo.voice = [];        
        contactinfo.chat.unshift(JSON.parse(JSON.stringify(chat)));
        chat.contactid = contactinfo.id;        
        chat.chat = contactinfo.chat.slice(0,10);
        chat.voice = contactinfo.voice.slice(0,10);
        delete contactinfo.chat;
        delete contactinfo.voice;
        chat.contactinfo = contactinfo;

        //console.log(user.id);

        //await RecentMsgModel.remove().exec();
        //For each user history...
        //console.log(contactinfo);

        await RecentMsgModel.updateOne({userid:user.id}, {
            $pull: {
                messages: {
                   fromNumber:chat.fromNumber, toNumber:chat.toNumber, contactid:contactinfo.id 
                }
            }
        }).exec();    
        
        RecentMsgModel.updateOne({userid:user.id}, {
            $push: {
                messages: {
                   $each: [ chat ],
                   $position: 0
                }
            }
        },{upsert:true}).exec().then((res)=>{}).catch(err=>{});


        //For admin....
        await RecentMsgModel.updateOne({userid:System_Code.user.role.admin}, {
            $pull: {
                messages: {
                   fromNumber:chat.fromNumber, toNumber:chat.toNumber, contactid:contactinfo.id
                }
            }
        }).exec();         
        RecentMsgModel.updateOne({userid:System_Code.user.role.admin}, {
            $push: {
                messages: {
                   $each: [ chat ],
                   $position: 0
                }
            }          
        },{upsert:true}).exec().then((res)=>{}).catch(err=>{});;     
        
        //For sending notification...
        axios.post(Config.notification_url+"/notification/send" ,{code:'new_sms', data:chat, id:user.id}).then(result=>{}).catch(err=>{});

        try{
            if(user.phonelink == 1){
                body = "From "+from + " - To "+to +"  Content\r\n "+body;
                twilio_controller.send_sms(user.phone.active_out, user.phone.active_in, body).then((res)=>{}).catch(err=>{});
            }
        }catch(ex){
            console.log(ex);
        }

        return user;
    }
 }

module.exports = sms_controller;