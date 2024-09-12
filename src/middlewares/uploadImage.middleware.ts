import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '..', '..', 'public', 'images'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req: any, file: any, cb: any)=>{
    const fileType = file.mimetype.split("/")[0]
    if (fileType === 'image') {
        return cb(null, true)
    }else {
        return cb(null, 'only images allowed')
    }
}

const uploadImage = () => { 
    return multer({ 
        storage,
        fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 2,
        }
    });
}

export default uploadImage;