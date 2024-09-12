import { Request, Response } from "express";
import Employee from "../../models/employee.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import { formatMediaFile } from "../../utils/meidaFormatter";
import { checkRequiredFields } from "../../utils/checkRequiredFields";

export const addEmployeeController = async (req: Request, res: Response) => {
    try {
        const { contact, gender, birth_date, position, fixed_salary, rewards = 0, deductions = 0 } = req.body;

        if (!checkRequiredFields(req, res, [
            'contact.first_name',
            'contact.second_name',
            'contact.third_name',
            'contact.address',
            'contact.phone',
            'gender',
            'position',
            'fixed_salary'
        ])) {
            return;
        }

        const oldEmployee = await Employee.findOne({
            $or: [
                { 'contact.phone': contact.phone },
                { 'contact.email': contact.email }
            ]
        }, { "__v": false });

        if (oldEmployee) {
            return res.status(401).json(formatResponse(httpStatus.ERROR, null, "Empolyee already exist!", 401))
        }

        let media = null

        if (req.file) {
            media = formatMediaFile(req.file as Express.Multer.File)
        }

        const newEmployee = new Employee({
            contact,
            gender,
            birth_date,
            position,
            fixed_salary: parseFloat(fixed_salary),
            rewards: parseFloat(rewards),
            deductions: parseFloat(deductions),
            media
        })

        const savedEmployee = await newEmployee.save();

        return res.status(201).json(formatResponse(httpStatus.SUCCESS, {employee: savedEmployee}, "Employee added successfully.", 201))
    } catch (err: any) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, err.message, 500))
    }
};

export const updateEmployeeController = async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.employeeId;

        let media = null

        if (req.file) {
            media = formatMediaFile(req.file as Express.Multer.File)
        }

        const targetEmployee = await Employee.findById(employeeId);

        if (!targetEmployee) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, "Employee not found.", 404));
        }

        const { fixed_salary = targetEmployee.fixed_salary, rewards = targetEmployee.rewards, deductions = targetEmployee.deductions } = req.body;

        const final_salary = fixed_salary + rewards - deductions;

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId,
            {
                $set: {
                    ...req.body,
                    final_salary,
                    ...(media && { media })
                }
            },
            { new: true, select: "-__v" }
        );

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, {employee: updatedEmployee}, "Employee updated successfully.", 200))
    } catch (err: any) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, err.message, 500))
    }
};

export const deleteEmployeeController = async (req: Request, res: Response) => {
    try {
        await Employee.findByIdAndDelete(req.params.employeeId);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, null, 'Employee deleted successfullly', 200));
    } catch (err: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, err.message, 500));
    }
};