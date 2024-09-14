import { Request, Response } from "express";
import Employee from "../../models/employee.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import mongoose from "mongoose";

export const getAllEmloyeesController = async (req: Request, res: Response) => {
    try {
        const { gender, position, minSalary, maxSalary, email, phone, name, id, page = 1, limit = 6 } = req.query;

        if (id) {
            if (!mongoose.isValidObjectId(id as string)) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Employee not found.', 404));
            }

            const employee = await Employee.findById(id as string).select('-__v');
            if (!employee) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'Employee not found.', 404));
            }
            return res.status(200).json(formatResponse(httpStatus.SUCCESS, { employee }, 'Employee fetched successfully.', 200));
        }

        let query: any = {};

        if (gender) {
            query.gender = gender;
        }

        if (position) {
            query.position = position;
        }

        if (minSalary || maxSalary || req.query.salary) {
            query.fixed_salary = {};
            if (minSalary) {
                query.fixed_salary.$gte = parseFloat(minSalary as string);
            }
            if (maxSalary) {
                query.fixed_salary.$lte = parseFloat(maxSalary as string);
            }
            if (req.query.salary) {
                query.fixed_salary.$eq = parseFloat(req.query.salary as string);
            }
        }

        if (email) {
            query['contact.email'] = new RegExp(email as string, 'i');
        }

        if (phone) {
            query['contact.phone'] = new RegExp(phone as string, 'i');
        }

        if (name) {
            const nameParts = (name as string).split(' ');
            query.$or = nameParts.map(part => ({
                $or: [
                    { 'contact.first_name': new RegExp(part, 'i') },
                    { 'contact.second_name': new RegExp(part, 'i') },
                    { 'contact.third_name': new RegExp(part, 'i') }
                ]
            }));
        }

        const pageNumber = parseInt(page as string, 10) || 1;
        const limitNumber = parseInt(limit as string, 10) || 6;
        const skip = (pageNumber - 1) * limitNumber;

        const totalEmployees = await Employee.countDocuments(query);

        const employees = await Employee.find(query, { "__v": false })
            .skip(skip)
            .limit(limitNumber);

        const totalPages = Math.ceil(totalEmployees / limitNumber);
        
        res.status(200).json(formatResponse(httpStatus.SUCCESS, { 
            employees, 
            total_employees: totalEmployees,
            page: pageNumber,
            limit: limitNumber,
            total_pages: totalPages
        }));
    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};