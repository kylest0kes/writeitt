import mongoose from 'mongoose';

const { Schema } = mongoose;

const CommentSchema = new Schema(
    {

    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
