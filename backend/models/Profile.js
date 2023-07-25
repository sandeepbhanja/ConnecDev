import mongoose from "mongoose";
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    company:{
        type: String,
    },
    website:{
        type:String,
    },
    location:{
        type:String,
    },
    status:{
        type:String,
        required:true,
    },
    skills:{
        type:[String],
        required:true,
    },
    bio:{
        type:String,
    },
    experience:[
        {
            title:{
                type:String,
            },
            company:{
                type:String,
            },
            location:{
                type:String,
            },
            from:{
                type:Date,
            },
            to:{
                type: Date,
            },
            current:{
                type: Boolean,
                default:false,
            },
            description:{
                type: String,
            }
        }
    ],
    education:[{
        college:{
            type:String,
        },
        degree:{
            type:String,
        },
        fieldofstudy:{
            type:String,
        },
        from:{
            type:Date,
        },
        to:{
            type:Date,
        }
    }],
    social:[{
        youtube:{
            type:String,
        },
        twitter:{
            type:String,
        },
        facebook:{
            type:String,
        },
        linkedin:{
            type:String,
        },
        instagram:{
            type:String,
        },
        github:{
            type:String,
        }
    }],
});

const Profile = mongoose.model('profile',profileSchema);

export default Profile;