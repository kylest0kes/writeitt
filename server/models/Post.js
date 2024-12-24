import mongoose from 'mongoose';

const { Schema } = mongoose;

const PostSchema = new Schema(
    {
        author: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'User',
           required: true
        },
        story: {
           type: mongoose.Schema.Types.ObjectId,
           ref: 'Story',
           required: true
        },
        title: {
            type: String,
            required: true,
            maxlength: 300,
            minlength: 5
        },
        body: {
            type: String,
            required: false,
            maxLength: 30000
        },
        media: {
            type: String,
            required: false,
            default: ""
        },
        upvotes: {
            type: Number,
            required: false,
            default: 0
        },
        downvotes: {
            type: Number,
            required: false,
            default: 0
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: 0
        }],
        slug: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;
