import { Request, Response } from "express";
import User from "../../models/user.model";
import { formatResponse } from "../../utils/formatResponse";
import { httpStatus } from "../../utils/httpStatusText";
import { checkRequiredFields } from "../../utils/checkRequiredFields";
import bcrypt from "bcryptjs"
import { formatMediaFile } from "../../utils/meidaFormatter";
import generateToken from "../../utils/generateToken";

export const registerController = async (req: Request, res: Response) => {
    try {
        const { name, email, password, c_password, phone, gender } = req.body;
        
        if (!checkRequiredFields(req, res, ['name', 'email', 'password', 'c_password'])) {
            return;
        }
        
        if (password !== c_password) {
            return res.status(401).json(formatResponse(httpStatus.FAIL, null, "The passwords are not matched!", 401))
        }

        // Check if the email is already exist or not
        const oldUser = await User.findOne({email: email},{"__v": false, "password": false})

        if (oldUser) {
            return res.status(401).json(formatResponse(httpStatus.ERROR, null, "User already exist!", 401))
        }

        let media = null

        if (req.file) {
            media = formatMediaFile(req.file as Express.Multer.File)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            gender,
            media
        })

        const token = generateToken({ email: newUser.email, id: newUser._id, role: newUser.role })
        newUser.token = token;
        
        await newUser.save()

        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || "",
            gender: newUser.gender || "",
            role: newUser.role,
            media: newUser.media
        }

        res.status(201).json(formatResponse(httpStatus.SUCCESS, { user: userResponse, token: token }, 'User registered successfully', 201))

    } catch (error: any) {
        res.status(500).json(formatResponse(httpStatus.ERROR, null, error.message, 45820));
    }
}