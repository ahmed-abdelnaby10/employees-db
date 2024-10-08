import express, { NextFunction, Request, Response } from "express"
import dotenv from 'dotenv';
import cors from 'cors'
import bodyParser from "body-parser";
import { formatResponse } from "../utils/formatResponse";
import { httpStatus } from "../utils/httpStatusText";
import { connectDB } from "../config/db";
import usersRouter from "../routes/user.route"
import employeesRouter from "../routes/employee.route"

dotenv.config()
export const app = express()

// Connect to MongoDB
connectDB()

// Middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', usersRouter);
app.use('/api/employees', employeesRouter);

// 404 Error Handler
app.all('*', (req: Request, res: Response) => {
    res.status(404).json(formatResponse(httpStatus.ERROR, null, "This resource isn't avilable.", 404));
});

// Global Error Handler
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatus.FAIL,
        message: error.message,
        code: error.statusCode,
        data: null
    });
});