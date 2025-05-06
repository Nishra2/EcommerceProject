'use client';
import React, { useState } from 'react';

interface ImageUploaderProps {
    onUpload: (uploadedImages: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
    const [images, setImages] = useState<Array<{ file: File, preview: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setImages([...images, ...newImages]);
    };



    const handleUpload = async () => {

        setLoading(true);
        setUploadMessage('');

        try {
            const formData = new FormData();
            images.forEach((image) => {
                formData.append('file', image.file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadMessage('Images uploaded successfully!');
                const data = await response.json();
                const uploadedImageUrls = data.fileIds.map((fileId: number) => `/api/retrieve?fileId=${fileId}`);

                onUpload(uploadedImageUrls);
                setImages([]);
            } else {
                const errorData = await response.json();
                setUploadMessage(`Upload failed: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            setUploadMessage('Upload failed: An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div className="flex flex-wrap">
                {images.map((image, index) => (
                    <div key={index} className="relative w-32 h-32 m-2">
                        <img src={image.preview} alt={`Preview ${index}`} className="object-cover w-full h-full" />
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleUpload} className="text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {uploadMessage && <p>{uploadMessage}</p>}
        </div>
    );
};

export default ImageUploader;
