var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connect(process.env.MONGODB_URL);
        console.log('MongoDB connected successfully!');
    }
    catch (err) {
        console.log('Failed to connect to MongoDB', err);
        process.exit(1);
    }
});
