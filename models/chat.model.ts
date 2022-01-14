import mongoose from "mongoose";

export interface ChatInput{
    discord_id: String;
    twitter_enabled: Boolean; 
    twitter_accounts: Array<String>;
}

export interface ChatDocument extends ChatInput, mongoose.Document{
    createdAt: Date;
    updatedAt: Date;   
}

const ChatSchema = new mongoose.Schema(
    {
        discord_id: {
            type: String,
            required: true,
            unique: true
        },
        twitter_enabled: {
            type: Boolean,
            required: true
        },
        twitter_accounts: {
            type: Array,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<ChatDocument>("Chat", ChatSchema);