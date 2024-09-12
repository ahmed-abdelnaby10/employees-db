import { Document, Types } from 'mongoose';
import { IMedia } from './media';

export interface IEmployee extends Document {
    contact : {
        first_name: string;
        second_name: string;
        third_name: string;
        phone: string;
        email: string;
        address: string;
    }
    birth_date: string;
    gender: string;
    position: string;
    fixed_salary: number;
    final_salary: number;
    rewards: number;
    deductions: number;
    created_at: Date;
    updated_at: Date;
    media: IMedia;
}