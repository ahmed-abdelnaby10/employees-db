import dotenv from 'dotenv';

dotenv.config();

const previewUrl = process.env.NODE_ENV === "production" ? `${process.env.PROD_URL}` : `${process.env.DEV_URL}`

export const formatMediaFile = (file: Express.Multer.File): {
    file_type: string, 
    original_url: string,
    preview_url: string,
    destination: string,
    file_name: string,
    file_extension: string,
    file_size: number,
    mime_type: string
} => {
    return {
        original_url: `/public/images/${file.filename}`,
        preview_url: `${previewUrl}/public/images/${file.filename}`,
        destination: file.destination,
        file_type: file.mimetype.split('/')[0],
        file_name: file.filename,
        file_extension: file.mimetype.split('/')[1],
        file_size: file.size,
        mime_type: file.mimetype,
    }
};
