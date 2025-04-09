'use client';

import { useState, useRef } from 'react';
import { upload, type PutBlobResult } from '@vercel/blob/client';
import Image from 'next/image';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  defaultImageUrl?: string;
}

export default function ImageUploader({ onImageUploaded, defaultImageUrl }: ImageUploaderProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(defaultImageUrl);
  const [error, setError] = useState<string | null>(null);
  
  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      // Create the path with the /image/ prefix
      const filename = `images/cigarettes/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      const blob = await upload(filename, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/products/upload',
      });
      
      setImageUrl(blob.url);
      onImageUploaded(blob.url);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputFileRef.current?.click()}
          disabled={isUploading}
          className={`px-4 py-2 text-sm rounded-md ${
            isUploading 
              ? 'bg-neutral-600 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white`}
        >
          {isUploading ? 'Uploading...' : 'Choose Image'}
        </button>
        <input
          ref={inputFileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleUpload(e.target.files[0]);
            }
          }}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      
      {imageUrl && (
        <div className="relative w-full h-40 bg-neutral-100 rounded-md overflow-hidden">
          <Image 
            src={imageUrl} 
            alt="Product image preview" 
            fill 
            style={{ objectFit: "contain" }} 
          />
          <button
            type="button"
            onClick={() => {
              setImageUrl(undefined);
              onImageUploaded('');
              if (inputFileRef.current) inputFileRef.current.value = '';
            }}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
            title="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}