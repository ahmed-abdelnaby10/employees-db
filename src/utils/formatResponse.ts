export const formatResponse = ( status: string, data: any, message?: string, code?: number) => {
    return {
        status,
        data,
        message,
        code
    };
};