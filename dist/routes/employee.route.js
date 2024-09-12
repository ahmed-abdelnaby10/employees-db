import { Router } from "express";
import uploadImage from "../middlewares/uploadImage.middleware";
import { authVerification } from "../middlewares/authVerification.middleware";
import { allowedTo } from "../middlewares/allowedTo.middleware";
import { userRoles } from "../utils/userRoles";
import { getAllEmloyeesController } from "../controllers/employees/getEmployees.controller";
import { addEmployeeController, deleteEmployeeController, updateEmployeeController } from "../controllers/employees/employees.controller";
const router = Router();
router.route('/employees')
    .get(authVerification, getAllEmloyeesController)
    .post(authVerification, uploadImage().single('media'), addEmployeeController);
router.route('/employees/:employeeId')
    .delete(authVerification, allowedTo(userRoles.MANAGER), deleteEmployeeController)
    .patch(authVerification, allowedTo(userRoles.MANAGER), uploadImage().single('media'), updateEmployeeController);
export default router;
