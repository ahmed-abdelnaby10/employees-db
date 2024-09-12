import mongoose, { Schema } from "mongoose";
import { IMedia } from "../types/media"; // Adjust the path as needed

const mediaSchema: Schema<IMedia> = new Schema({
    original_url: { type: String, required: true },
    preview_url: { type: String, required: true },
    destination: { type: String, required: true },
    file_type: { type: String, required: true },
    file_name: { type: String, required: true },
    file_extension: { type: String, required: true },
    file_size: { type: Number, required: true },
    mime_type: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
}, { _id: false });

export default mediaSchema;
