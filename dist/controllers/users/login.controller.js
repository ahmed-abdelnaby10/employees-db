var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../../models/user.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import bcrypt from "bcryptjs";
import generateToken from "../../utils/generateToken";
export const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User.findOne({ email: email }, { __v: false });
        if (!email && !password) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Email and password are required', 401));
        }
        if (!user) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Email is invalid', 401));
        }
        const matchedPassword = yield bcrypt.compare(password, user.password);
        if (user && matchedPassword) {
            const token = generateToken({ email: user.email, id: user._id, role: user.role });
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at,
            };
            res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: userResponse, token }, 'User logined successfully', 200));
        }
        else {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Password is invalid', 401));
        }
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
