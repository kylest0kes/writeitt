import mongoose from "mongoose";

const { Schema } = mongoose;

const StorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 21,
            minlength: 3,
            trim: true,
            unique: true
        },
        img: {
            type: String,
            required: false,
            default: ""
        },
        subtitle: {
            type: String,
            required: true,
            maxlength: 50
        },
        description: {
            type: String,
            required: true,
            maxlength: 500
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        subscribers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        postCount: {
            type: Number,
            default: 0
        },
        subscriberCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

// Indexes for improved query performance
StorySchema.index({ name: 1 });
StorySchema.index({ creator: 1 });
StorySchema.index({ subscribers: 1 });

const Story = mongoose.model("Story", StorySchema);

export default Story;
