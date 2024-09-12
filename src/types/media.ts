export interface IMedia {
    original_url: string;
    preview_url: string;
    destination: string;
    file_type: string;
    file_name: string;
    file_extension: string;
    file_size: number;
    mime_type: string;
    created_at?: Date;
    updated_at?: Date;
    _id?: string;
}