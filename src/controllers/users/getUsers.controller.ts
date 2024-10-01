import { Request, Response } from "express";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import mongoose from "mongoose";
import User from "../../models/user.model";

export const getAllUsersController = async (req: Request, res: Response) => {
    try {
        const { email, name, id, sortBy, order } = req.query;

        const page = parseInt(req.query.page as string) || 1;
        const limit = 6
        const skip = (page - 1) * limit;

        const sortField = sortBy as string || "name";
        const sortOrder = order === "desc" ? -1 : 1; 

        if (id) {
            if (!mongoose.isValidObjectId(id as string)) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
            }

            const user = await User.findById(id as string).select('-__v -password');
            if (!user) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
            }
            return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user }, 'User fetched successfully.', 200));
        }

        let query: any = {};

        if (email) {
            query['email'] = new RegExp(email as string, 'i');
        }

        if (name) {
            query['name'] = new RegExp(name as string, 'i');
        }

        const totalUsers = await User.countDocuments(query);

        const users = await User.find(query)
            .select('-__v -password')
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalPages = Math.ceil(totalUsers / limit)
        
        res.status(200).json(formatResponse(httpStatus.SUCCESS, { 
            users,
            page,
            limit,
            total_users: totalUsers,
            total_pages: totalPages
        }));
    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
};