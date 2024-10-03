import { Request, Response } from "express";
import User from "../../models/user.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import bcrypt from "bcryptjs"
import generateToken from "../../utils/generateToken";


export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }, {__v: false});

        if(!email && !password) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Email and password are required', 401));
        }

        if (!user) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Email is invalid', 401));
        }

        const matchedPassword = await bcrypt.compare(password, user.password)

        if (user && matchedPassword) {
            const token = generateToken({ email: user.email, id: user._id, role: user.role });
            const userResponse = {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                gender: user.gender,
                phone: user.phone,
                created_at: user.created_at,
                updated_at: user.updated_at,
                media: user.media
            }
            res.status(200).json(formatResponse(httpStatus.SUCCESS, { user: userResponse, token }, 'User logined successfully', 200));
        }else {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, 'Password is invalid', 401));
        }
    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 500));
    }
}