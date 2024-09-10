import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            reqired: true
        },
        body: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
