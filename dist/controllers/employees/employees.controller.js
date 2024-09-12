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
import { formatMediaFile } from '../../utils/meidaFormatter.js';
import { checkRequiredFields } from '../../utils/checkRequiredFields.js';
export const addEmployeeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const oldEmployee = yield Employee.findOne({
            $or: [
                { 'contact.phone': contact.phone },
                { 'contact.email': contact.email }
            ]
        }, { "__v": false });
        if (oldEmployee) {
            return res.status(401).json(formatResponse(httpStatus.ERROR, null, "Empolyee already exist!", 401));
        }
        let media = null;
        if (req.file) {
            media = formatMediaFile(req.file);
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
        });
        const savedEmployee = yield newEmployee.save();
        return res.status(201).json(formatResponse(httpStatus.SUCCESS, { employee: savedEmployee }, "Employee added successfully.", 201));
    }
    catch (err) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, err.message, 500));
    }
});
export const updateEmployeeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = req.params.employeeId;
        let media = null;
        if (req.file) {
            media = formatMediaFile(req.file);
        }
        const targetEmployee = yield Employee.findById(employeeId);
        if (!targetEmployee) {
            return res.status(404).json(formatResponse(httpStatus.ERROR, null, "Employee not found.", 404));
        }
        const { fixed_salary = targetEmployee.fixed_salary, rewards = targetEmployee.rewards, deductions = targetEmployee.deductions } = req.body;
        const final_salary = fixed_salary + rewards - deductions;
        const updatedEmployee = yield Employee.findByIdAndUpdate(employeeId, {
            $set: Object.assign(Object.assign(Object.assign({}, req.body), { final_salary }), (media && { media }))
        }, { new: true, select: "-__v" });
        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { employee: updatedEmployee }, "Employee updated successfully.", 200));
    }
    catch (err) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, err.message, 500));
    }
});
export const deleteEmployeeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Employee.findByIdAndDelete(req.params.employeeId);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, null, 'Employee deleted successfullly', 200));
    }
    catch (err) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, err.message, 500));
    }
});
