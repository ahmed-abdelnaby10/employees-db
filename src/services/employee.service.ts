import { IEmployee } from '../types/employee';
import Employee from '../models/employee.model';

export const searchEmployees = async (
  searchText: string,
  minSalary?: number,
  maxSalary?: number
): Promise<{ total: number; employees: IEmployee[] }> => {
  const pipeline: any[] = [
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
        final_salary: {
          ...(minSalary && { $gte: minSalary }),
          ...(maxSalary && { $lte: maxSalary })
        }
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

  const employees = await Employee.aggregate(pipeline);

  return {
    total: employees.length,
    employees
  };
};
