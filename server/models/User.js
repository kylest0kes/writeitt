import { kMaxLength } from "buffer";
import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false,
        default: ' '
    },
    userImg: {
        type: String,
        required: false,
        default: 'http://via.placeholder.com/350x350'
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;