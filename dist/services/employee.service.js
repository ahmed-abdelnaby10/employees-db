var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Employee from '../models/employee.model';
export const searchEmployees = (searchText, minSalary, maxSalary) => __awaiter(void 0, void 0, void 0, function* () {
    const pipeline = [
        {
            $search: {
                index: 'project-2.employees',
                text: {
                    query: searchText,
                    path: ['first_name', 'email', 'position'],
                    fuzzy: {}
                }
            }
        },
        {
            $match: {
                final_salary: Object.assign(Object.assign({}, (minSalary && { $gte: minSalary })), (maxSalary && { $lte: maxSalary }))
            }
        },
        {
            $project: {
                _id: 1,
                contact: 1,
                position: 1,
                final_salary: 1,
                rewards: 1,
                deductions: 1
            }
        }
    ];
    const employees = yield Employee.aggregate(pipeline);
    return {
        total: employees.length,
        employees
    };
});
