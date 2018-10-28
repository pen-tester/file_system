var SystemCode={
    http:{
        forbidden:403,
        unauthorized:401,
        bad_req:400,
        req_ok:200
    },
    user:{
        role:{
            admin:1000,
            user:1
        },
        status:{
            inactive:0,
            active:1,
            removed:2 //equal to deleted
        },
        permission:{
            active:1,
            inactive:0
        },
        phone:{
            active:1,
            inactive:0            
        }
        
    },
    property_owner:{
        status:{
            inactive:0,
            active:1,
            disabled:2,
            removed:3000
        }
    },
    message:{
        type:{
            outgoing:0,
            incoming:1
        }
    },

    responsecode:{
        param_missing_error:{
            code:300,
            msg:"Parameter is missing."
        },
        db_error:{
            code:901,
            msg:"The service couldn\'t work with db now."
        },
        no_user:{
            code:404,
            msg:"The email is not existed or Password is incorrect"
        },
        duplicated_user:{
            code:405,
            msg:"The email is exised"
        },
        unauthorized:{
            code:401,
            msg:"The user is not authenticated."
        },
        unknown:{
            code:700,
            msg:"Unknown error."
        },        
        role_error:{
            code:302,
            msg:"role is not permitted"
        },
        propertyowner_model_error:{
            code:303,
            msg:"The error caused by mongodb propery owner."
        },        
        req_success:{
            code:200,
            msg:"Successfully requested."
        },
        jwt_authen_error:{
            code:403,
            msg:"JWT token is broken."
        },

        purchase_error:{
            code:500,
            msg:"Successfully requested."
        }
    },    
    requestcode:{

    }
}

module.exports=SystemCode;