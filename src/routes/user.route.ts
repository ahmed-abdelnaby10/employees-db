import { Router } from "express"
import uploadImage from "../middlewares/uploadImage.middleware"
import { registerController } from "../controllers/users/register.controller"
import { loginController } from "../controllers/users/login.controller"
import { authVerification } from "../middlewares/authVerification.middleware"
import { allowedTo } from "../middlewares/allowedTo.middleware"
import { userRoles } from "../utils/userRoles"
import { 
    deleteUserController, 
    getAllUsersController, 
    updateUserController 
} from "../controllers/users/users.controller"

const router = Router()

router.post('/register', uploadImage().single('media'), registerController)
router.post('/login', loginController);

router.route('/users')
    .get(authVerification, allowedTo(userRoles.MANAGER), getAllUsersController);

router.route('/users/:userId')
    .delete(authVerification, allowedTo(userRoles.MANAGER), deleteUserController)
    .patch(authVerification, uploadImage().single('media'), updateUserController)

export default router