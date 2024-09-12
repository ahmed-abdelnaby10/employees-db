var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../../models/user.model.js';
import { formatResponse } from '../../utils/formatResponse.js';
import { httpStatus } from '../../utils/httpStatusText.js';
import { checkRequiredFields } from '../../utils/checkRequiredFields.js';
import bcrypt from "bcryptjs";
import { formatMediaFile } from '../../utils/meidaFormatter.js';
import generateToken from '../../utils/generateToken.js';
export const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, c_password, phone, gender } = req.body;
        if (!checkRequiredFields(req, res, ['name', 'email', 'password', 'c_password'])) {
            return;
        }
        if (password !== c_password) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, "The passwords are not matched!", 401));
        }
        // Check if the email is already exist or not
        const oldUser = yield User.findOne({ email: email }, { "__v": false, "password": false });
        if (oldUser) {
            return res.status(401).json(formatResponse(httpStatus.ERROR, null, "User already exist!", 401));
        }
        let media = null;
        if (req.file) {
            media = formatMediaFile(req.file);
        }
        const hashedPassword = yield bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            media
        });
        const token = generateToken({ email: newUser.email, id: newUser._id, role: newUser.role });
        newUser.token = token;
        yield newUser.save();
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || "",
            gender: newUser.gender || "",
            role: newUser.role,
            media: newUser.media
        };
        res.status(201).json(formatResponse(httpStatus.SUCCESS, { user: userResponse, token: token }, 'User registered successfully', 201));
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 45820));
    }
});
