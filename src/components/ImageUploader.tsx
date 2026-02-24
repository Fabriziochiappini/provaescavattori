import React, { useState } from 'react';

interface ImageUploaderProps {
    onUpload?: (file: File) => Promise<void>; // Make optional
    onUploadMultiple?: (files: File[]) => Promise<void>; // New prop for bulk
    label?: string;
    accept?: string;
    maxSizeMB?: number;
    disabled?: boolean;
    multiple?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onUpload,
    onUploadMultiple,
    label = "Carica Immagine",
    accept = "image/*",
    maxSizeMB = 5,
    disabled = false,
    multiple = false
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;

        // Check sizes
        const invalidFile = files.find(f => f.size > maxSizeMB * 1024 * 1024);
        if (invalidFile) {
            setError(`Il file ${invalidFile.name} è troppo grande (Max ${maxSizeMB}MB)`);
            return;
        }

        setUploading(true);
        setError(null);

        try {
            if (onUploadMultiple) {
                // Bulk upload handler
                await onUploadMultiple(files);
            } else if (onUpload) {
                // Sequential single upload handler (legacy)
                for (const file of files) {
                    await onUpload(file);
                }
            }
        } catch (err) {
            console.error(err);
            setError("Errore durante il caricamento.");
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                {uploading ? (
                    <span className="material-icons-outlined animate-spin text-primary">refresh</span>
                ) : (
                    <span className="material-icons-outlined text-gray-500">cloud_upload</span>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {uploading ? "Caricamento..." : label}
                </span>
                <input
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                    disabled={disabled || uploading}
                    multiple={multiple}
                />
            </label>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUploader;
