import { Request, Response } from "express";
import User from "../../models/user.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import { userRoles } from "../../utils/userRoles";
import { formatMediaFile } from "../../utils/meidaFormatter";
import bcrypt from "bcryptjs"
import { checkRequiredFields } from "../../utils/checkRequiredFields";

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, {"__v": false, "password": false});
        res.status(200).json(formatResponse(httpStatus.SUCCESS, { users }));
    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const updateUserController = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const userId = req.params.userId;

        // Allow role update only for managers
        if (role && req.user?.role !== userRoles.MANAGER) {
            return res.status(403).json(formatResponse(httpStatus.SUCCESS, null, "You aren't allowed to this action", 403));
        } 

        let media = null;
        if (req.file) {
            media = formatMediaFile(req.file as Express.Multer.File);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {$set: {
            ...req.body,
            ...(media && { media })
        }},
            { new: true }
        ).select("-password -__v");

        res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: updatedUser }, "User updated successfully", 200));

    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}

export const changePasswordController = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const { oldPassword, newPassword, c_password } = req.body;

        const user = await User.findById(userId).select("+password");

        if (!user) {
            return res.status(404).json(formatResponse(httpStatus.FAIL, null, "User not found!", 404));
        }

        if (!checkRequiredFields(req, res, ['oldPassword', 'newPassword', 'c_password'])) {
            return;
        }

        const matchedPassword = await bcrypt.compare(oldPassword, user.password);
        if (!matchedPassword) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, "Old password is incorrect", 401));
        }

        if (newPassword !== c_password) {
            return res.status(400).json(formatResponse(httpStatus.FAIL, null, "Passwords do not match", 400));
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true, fields: { password: 0, __v: 0 } }
        );

        return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: updatedUser }, "Password changed successfully", 200));

    } catch (error: any) {
        return res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, null, 'User deleted successfullly', 200));
    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};