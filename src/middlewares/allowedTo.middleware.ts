import { Request, Response, NextFunction } from 'express';

export const allowedTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Not authorized for ${req.user.role}` });
        }

        next();
    };
};
