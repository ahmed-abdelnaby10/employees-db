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
import { userRoles } from '../../utils/userRoles.js';
import { formatMediaFile } from '../../utils/meidaFormatter.js';
import bcrypt from "bcryptjs";
import { checkRequiredFields } from '../../utils/checkRequiredFields.js';
export const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find({}, { "__v": false, "password": false });
        res.status(200).json(formatResponse(httpStatus.SUCCESS, { users }));
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
export const updateUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { role } = req.body;
        const userId = req.params.userId;
        // Allow role update only for managers
        if (role && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== userRoles.MANAGER) {
            return res.status(403).json(formatResponse(httpStatus.SUCCESS, null, "You aren't allowed to this action", 403));
        }
        let media = null;
        if (req.file) {
            media = formatMediaFile(req.file);
        }
        const updatedUser = yield User.findByIdAndUpdate(userId, { $set: Object.assign(Object.assign({}, req.body), (media && { media })) }, { new: true }).select("-password -__v");
        res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: updatedUser }, "User updated successfully", 200));
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
export const changePasswordController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const { oldPassword, newPassword, c_password } = req.body;
        const user = yield User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, "User not found!", 404));
        }
        if (!checkRequiredFields(req, res, ['oldPassword', 'newPassword', 'c_password'])) {
            return;
        }
        const matchedPassword = yield bcrypt.compare(oldPassword, user.password);
        if (!matchedPassword) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, "Old password is incorrect", 401));
        }
        if (newPassword !== c_password) {
            return res.status(400).json(formatResponse(httpStatus.FAIL, null, "Passwords do not match", 400));
        }
        const hashedPassword = yield bcrypt.hash(newPassword, 10);
        const updatedUser = yield User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true, fields: { password: 0, __v: 0 } });
        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: updatedUser }, "Password changed successfully", 200));
    }
    catch (error) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
export const deleteUserController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findByIdAndDelete(req.params.userId);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, null, 'User deleted successfullly', 200));
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
