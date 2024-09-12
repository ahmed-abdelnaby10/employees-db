var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Employee from '../../models/employee.model.js';
import { formatResponse } from '../../utils/formatResponse.js';
import { httpStatus } from '../../utils/httpStatusText.js';
import mongoose from "mongoose";
export const getAllEmloyeesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gender, position, minSalary, maxSalary, email, phone, name, id } = req.query;
        if (id) {
            if (!mongoose.isValidObjectId(id)) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Employee not found.', 404));
            }
            const employee = yield Employee.findById(id).select('-__v');
            if (!employee) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Employee not found.', 404));
            }
            return res.status(200).json(formatResponse(httpStatus.SUCCESS, { employee }, 'Employee fetched successfully.', 200));
        }
        let query = {};
        if (gender) {
            query.gender = gender;
        }
        if (position) {
            query.position = position;
        }
        if (minSalary || maxSalary || req.query.salary) {
            query.fixed_salary = {};
            if (minSalary) {
                query.fixed_salary.$gte = parseFloat(minSalary);
            }
            if (maxSalary) {
                query.fixed_salary.$lte = parseFloat(maxSalary);
            }
            if (req.query.salary) {
                query.fixed_salary.$eq = parseFloat(req.query.salary);
            }
        }
        if (email) {
            query['contact.email'] = new RegExp(email, 'i');
        }
        if (phone) {
            query['contact.phone'] = new RegExp(phone, 'i');
        }
        if (name) {
            const nameParts = name.split(' ');
            query.$or = nameParts.map(part => ({
                $or: [
                    { 'contact.first_name': new RegExp(part, 'i') },
                    { 'contact.second_name': new RegExp(part, 'i') },
                    { 'contact.third_name': new RegExp(part, 'i') }
                ]
            }));
        }
        const totalEmployees = yield Employee.countDocuments(query);
        const employees = yield Employee.find(query, { "__v": false });
        res.status(200).json(formatResponse(httpStatus.SUCCESS, { employees, total: totalEmployees }));
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
