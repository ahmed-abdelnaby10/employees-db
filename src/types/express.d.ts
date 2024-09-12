import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            query?: {
                [key: string]: any;
            };
        }
    }
}
