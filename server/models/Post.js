import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema(
    {
        author: {
            type: String,
            required: true
        },
        subpage: {
            type: String,
            required: true
        },
        subpageLink: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: false,
            maxLength: 20000
        },
        images: {
            type: String,
            required: false
        },
        video: {
            type: String,
            required: false
        },
        likes: {
            type: String,
            required: false
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
