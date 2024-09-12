import { Router } from "express";
import uploadImage from '../middlewares/uploadImage.middleware.js';
import { authVerification } from '../middlewares/authVerification.middleware.js';
import { allowedTo } from '../middlewares/allowedTo.middleware.js';
import { userRoles } from '../utils/userRoles.js';
import { getAllEmloyeesController } from '../controllers/employees/getEmployees.controller.js';
import { addEmployeeController, deleteEmployeeController, updateEmployeeController } from '../controllers/employees/employees.controller.js';
const router = Router();
router.route('/employees')
    .get(authVerification, getAllEmloyeesController)
    .post(authVerification, uploadImage().single('media'), addEmployeeController);
router.route('/employees/:employeeId')
    .delete(authVerification, allowedTo(userRoles.MANAGER), deleteEmployeeController)
    .patch(authVerification, allowedTo(userRoles.MANAGER), uploadImage().single('media'), updateEmployeeController);
export default router;
