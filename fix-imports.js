import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'dist');

function fixImports(directory) {
    try {
        fs.readdirSync(directory).forEach(file => {
            const fullPath = path.join(directory, file);

            if (fs.statSync(fullPath).isDirectory()) {
                fixImports(fullPath);
            } else if (path.extname(fullPath) === '.js') {
                let content = fs.readFileSync(fullPath, 'utf-8');
                
                const updatedContent = content.replace(
                    /from\s+['"](\.[^'"]+)['"]/g,  // Match only relative imports
                    (match, p1) => {
                        // If the path doesn't already have a .js extension, add it
                        if (!p1.endsWith('.js')) {
                            return `from '${p1}.js'`;
                        }
                        return match;
                    }
                );

                if (content !== updatedContent) {
                    fs.writeFileSync(fullPath, updatedContent, 'utf-8');
                }
            }
        });
    } catch (error) {
        console.error('Error processing directory:', directory, error);
    }
}

fixImports(directoryPath);