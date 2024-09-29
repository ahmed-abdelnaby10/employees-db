import { Router } from "express";
import uploadImage from '../middlewares/uploadImage.middleware.js';
import { registerController } from '../controllers/users/register.controller.js';
import { loginController } from '../controllers/users/login.controller.js';
import { authVerification } from '../middlewares/authVerification.middleware.js';
import { allowedTo } from '../middlewares/allowedTo.middleware.js';
import { userRoles } from '../utils/userRoles.js';
import { changePasswordController, deleteUserController, getAllUsersController, updateUserController } from '../controllers/users/users.controller.js';
const router = Router();
router.post('/register', uploadImage().single('media'), registerController);
router.post('/login', loginController);
router.route('/users')
    .get(authVerification, allowedTo(userRoles.MANAGER), getAllUsersController);
router.route('/users/:userId')
    .delete(authVerification, allowedTo(userRoles.MANAGER), deleteUserController)
    .patch(authVerification, uploadImage().single('media'), updateUserController);
router.route('/users/:userId/change-password')
    .patch(authVerification, changePasswordController);
export default router;
