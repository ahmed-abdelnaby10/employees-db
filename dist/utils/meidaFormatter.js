import dotenv from 'dotenv';
dotenv.config();
const previewUrl = process.env.NODE_ENV === "production" ? `${process.env.PROD_URL}` : `${process.env.DEV_URL}`;
export const formatMediaFile = (file) => {
    return {
        original_url: `/images/${file.filename}`,
        preview_url: `${previewUrl}/images/${file.filename}`,
        destination: file.destination,
        file_type: file.mimetype.split('/')[0],
        file_name: file.filename,
        file_extension: file.mimetype.split('/')[1],
        file_size: file.size,
        mime_type: file.mimetype,
    };
};
