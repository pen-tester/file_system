var md5 = require('md5');
var CRC = require('crc');

var global_area = require('../../config/global');  

var Util = require('../../utils/utils');
//System Codes for request, respond, some types
var System_Code = require('../../config/system_code');
var Config  = require('../../config/config');


//User DB...
var ContactModel = require('../../models/contact');
var ContactInfoModel = require('../../models/contactinfo');
var ContactListModel = require('../../models/contactlist');
var UserModel = require('../../models/users');
var CampaignModel = require('../../models/campaign');
var RecentMsgModel = require('../../models/recent_message');

var twilio_controller = require('./twilio');
 
 sms_controller = {
    async send_sms(contactid, from, to , body){
        //console.log(from, to, body);
        var user = await UserModel.findOne({'phone.outgoing.phone':from}).exec();

        var timestampe = Date.now();
        var message_id = "mg" + Math.floor((1 + Math.random())* 1000).toString(10).substring(1) + timestampe;  
        var chat = { 
            type: 0,
            content: body,
            fromNumber: from,
            toNumber: to,
            userid: user.id ,
            id: message_id,
            created:timestampe
        };
        //console.log(chat, user);
        await ContactInfoModel.updateOne({id:contactid}, {
            $push: {
                chat: {
                   $each: [ chat ],
                   $position: 0
                }
            }
        }).exec();
        this.update_recent_message(contactid, chat);
           
        twilio_controller.send_sms(from, to, body).then((result)=>{}).catch(err=>{Util.logger(err)});

        return chat;
    },
    async update_recent_message(contactid, chat_item){
        var contact = await ContactInfoModel.findOne({id:contactid}).lean().exec();
        chats = contact.chat.slice(0,10);
        try{
            var sobj = {};    
            sobj["messages.$[element].chat"] = chats;
            RecentMsgModel.updateMany({},   { $set: sobj },
            { arrayFilters: [ { "element.contactinfo.id":contactid, "element.fromNumber":chat_item.toNumber} ] }).exec();
        }
        catch(e){
            Util.logger(e);
        }         
    }
 }

module.exports = sms_controller;