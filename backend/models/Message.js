import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    from:{
        type: Schema.Types.ObjectId,
        ref:'user',
    },
    text:{
        type: String,
        required: true,
    },
    chat:{
        type: Schema.Types.ObjectId,
        ref:'chat',
    }
},{timestamps:true});

const Message = mongoose.model('message',messageSchema);

export default Message;