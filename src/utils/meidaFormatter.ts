export const formatMediaFile = (file: any): {
    file_type: string;
    original_url: string;
    preview_url: string;
    file_name: string;
    file_extension: string;
    file_size: number;
    mime_type: string;
} => {
    return {
        original_url: file.path,
        preview_url: file.path,
        file_type: file.mimetype.split('/')[0],
        file_name: file.originalname,
        file_extension: file.mimetype.split('/')[1],
        file_size: file.size,
        mime_type: file.mimetype,
    }
};
