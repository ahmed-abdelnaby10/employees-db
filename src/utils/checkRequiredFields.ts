// import { Request, Response } from 'express';
// import { formatResponse } from './formatResponse';
// import { httpStatus } from './httpStatusText';

// export const checkRequiredFields = (req: Request, res: Response, fields: string[]): boolean => {
//     const missingFields = fields.filter(field => !req.body[field]);

//     if (missingFields.length > 0) {
//         const message = missingFields.length === 1
//             ? `${missingFields[0]} is required`
//             : `${missingFields.join(' and ')} are required`;

//         res.status(400).json(formatResponse(httpStatus.ERROR, null, message));
//         return false;
//     }

//     return true;
// };

import { Request, Response } from 'express';
import { formatResponse } from './formatResponse';
import { httpStatus } from './httpStatusText';

export const checkRequiredFields = (req: Request, res: Response, fields: string[]): boolean => {
    const body = req.body;

    // Helper function to access nested fields
    const getNestedValue = (field: string, data: any) => {
        const fieldParts = field.split('.');
        let value = data;
        for (const part of fieldParts) {
            if (value && typeof value === 'object') {
                value = value[part];
            } else {
                return undefined;
            }
        }
        return value;
    };

    const missingFields = fields.filter(field => !getNestedValue(field, body));

    if (missingFields.length > 0) {
        const message = missingFields.length === 1
            ? `${missingFields[0]} is required`
            : `${missingFields.join(' and ')} are required`;

        res.status(400).json(formatResponse(httpStatus.ERROR, null, message));
        return false;
    }

    return true;
};
