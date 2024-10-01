var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { formatResponse } from '../../utils/formatResponse.js';
import { httpStatus } from '../../utils/httpStatusText.js';
import mongoose from "mongoose";
import User from '../../models/user.model.js';
export const getAllUsersController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, id, sortBy, order } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;
        const sortField = sortBy || "name";
        const sortOrder = order === "desc" ? -1 : 1;
        if (id) {
            if (!mongoose.isValidObjectId(id)) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
            }
            const user = yield User.findById(id).select('-__v -password');
            if (!user) {
                return res.status(404).json(formatResponse(httpStatus.ERROR, null, 'User not found.', 404));
            }
            return res.status(200).json(formatResponse(httpStatus.SUCCESS, { user }, 'User fetched successfully.', 200));
        }
        let query = {};
        if (email) {
            query['email'] = new RegExp(email, 'i');
        }
        if (name) {
            query['name'] = new RegExp(name, 'i');
        }
        const totalUsers = yield User.countDocuments(query);
        const users = yield User.find(query)
            .select('-__v -password')
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(totalUsers / limit);
        res.status(200).json(formatResponse(httpStatus.SUCCESS, {
            users,
            page,
            limit,
            total_users: totalUsers,
            total_pages: totalPages
        }));
    }
    catch (error) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
});
