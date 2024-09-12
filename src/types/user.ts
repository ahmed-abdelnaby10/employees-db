import { Document } from 'mongoose';
import { IMedia } from './media';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    c_password: string;
    phone?: string;
    gender?: string;
    role: string;
    created_at: Date;
    updated_at: Date;
    media: IMedia;
    token: string
}