import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { userRoles } from "../utils/userRoles";
import mediaSchema from "./media.model";
const { isEmail } = validator;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [isEmail, 'field must be a valid email']
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
    },
    role: {
        type: String,
        enum: [userRoles.USER, userRoles.MANAGER, userRoles.ADMIN],
        default: userRoles.ADMIN
    },
    media: {
        type: mediaSchema,
        required: false,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const User = mongoose.model('User', userSchema);
export default User;
