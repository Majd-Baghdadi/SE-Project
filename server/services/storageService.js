const supabase = require("../config/supabase");

const BUCKET_NAME = "document_images";

// Generate unique filename
const generateFileName = (originalName) => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
};

// Upload image to Supabase storage
const uploadImage = async (file) => {
    const fileName = generateFileName(file.originalname);

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });

    if (error) {
        console.error('Failed to upload image:', error);
        throw new Error('Failed to upload image');
    }

    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);

    return data.publicUrl;
};

// Delete image from Supabase storage
const deleteImage = async (publicUrl) => {
    // Extract filename from URL
    const fileName = publicUrl.split('/').pop();

    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([fileName]);

    if (error) {
        console.error('Failed to delete image:', error);
        throw new Error('Failed to delete image');
    }

    return true;
};

module.exports = { uploadImage, deleteImage };