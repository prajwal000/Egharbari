import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    url: string;
    publicId: string;
}

export async function uploadImage(
    file: string, 
    folder: string = 'egharbari/properties'
): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'image',
            transformation: [
                { width: 1200, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload image');
    }
}

export async function uploadMultipleImages(
    files: string[],
    folder: string = 'egharbari/properties'
): Promise<UploadResult[]> {
    const uploadPromises = files.map((file) => uploadImage(file, folder));
    return Promise.all(uploadPromises);
}

export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}

export async function deleteMultipleImages(publicIds: string[]): Promise<void> {
    try {
        await cloudinary.api.delete_resources(publicIds);
    } catch (error) {
        console.error('Cloudinary bulk delete error:', error);
    }
}

export default cloudinary;












