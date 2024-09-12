import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { formatResponse } from "../utils/formatResponse";
import { httpStatus } from "../utils/httpStatusText";
import { connectDB } from "../config/db";
import usersRouter from "../routes/user.route";
import employeesRouter from "../routes/employee.route";
dotenv.config();
export const app = express();
// Define filename and dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Connect to MongoDB
connectDB();
// Middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public/images', express.static(join(__dirname, '..', '..', 'public', 'images')));
// Routes
app.use('/api/auth', usersRouter);
app.use('/api', employeesRouter);
// 404 Error Handler
app.all('*', (req, res) => {
    res.status(404).json(formatResponse(httpStatus.ERROR, null, "This resource isn't avilable.", 404));
});
// Global Error Handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatus.FAIL,
        message: error.message,
        code: error.statusCode,
        data: null
    });
});
