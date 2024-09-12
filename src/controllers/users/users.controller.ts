import { Request, Response } from "express";
import User from "../../models/user.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import { userRoles } from "../../utils/userRoles";
import { formatMediaFile } from "../../utils/meidaFormatter";

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

        const updatedUser = await User.updateOne({_id: userId}, {$set: {
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

export const deleteUserController = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, null, 'User deleted successfullly', 200));
    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};