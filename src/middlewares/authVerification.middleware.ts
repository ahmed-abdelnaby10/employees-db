import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"


const JWT_SECRET = process.env.JWT_SECRET_KEY as string

export const authVerification = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string = req.headers['authorization'] as string || req.headers['Authorization'] as string
    
    
    if (!authHeader) {
        return res.status(401).json({ message: "Token is requierd" })
    }
    
    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ message: "Token is requierd" })
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });

        // Type guard to ensure decoded is JwtPayload
        if (typeof decoded === 'object' && decoded !== null) {
            req.user = decoded as JwtPayload;
            next();
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    })
}