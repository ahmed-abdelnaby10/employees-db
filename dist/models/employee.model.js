import mongoose, { Schema } from "mongoose";
import mediaSchema from './media.model.js';
const employeeSchema = new Schema({
    contact: {
        first_name: {
            type: String,
            required: true
        },
        second_name: {
            type: String,
            required: true
        },
        third_name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
    },
    gender: {
        type: String,
        required: true
    },
    birth_date: {
        type: String,
        required: false
    },
    position: {
        type: String,
        required: true
    },
    fixed_salary: {
        type: Number,
        required: true
    },
    final_salary: {
        type: Number,
    },
    rewards: {
        type: Number,
        default: 0,
    },
    deductions: {
        type: Number,
        default: 0,
    },
    media: {
        type: mediaSchema,
        required: false,
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
employeeSchema.pre('save', function (next) {
    const employee = this;
    employee.final_salary = employee.fixed_salary + employee.rewards - employee.deductions;
    next();
});
const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
