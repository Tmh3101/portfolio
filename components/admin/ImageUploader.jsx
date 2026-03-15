'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '../../lib/supabase/client';

/**
 * ImageUploader component for admin forms.
 * Handles uploading images directly to Supabase Storage.
 *
 * @param {Object} props
 * @param {string} props.value - Current image URL (if any).
 * @param {function} props.onChange - Callback with the new image URL.
 * @param {string} props.bucket - Supabase Storage bucket name (default: 'portfolio-assets').
 * @param {string} props.folder - Optional subfolder in the bucket.
 * @param {string} props.label - Label for the uploader.
 * @param {string} props.error - Error message if validation fails.
 */
const ImageUploader = ({
  value,
  onChange,
  bucket = 'portfolio-assets',
  folder = '',
  label = 'Upload Image',
  error,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const supabase = getSupabaseBrowserClient();

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Please upload an image smaller than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(10);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(filePath);

      setUploadProgress(100);
      onChange(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-bold text-[#4a5968]">{label}</label>}

      <div
        className={`relative group border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 
          ${error ? 'border-red-500 bg-red-50' : 'border-[#d8e0e8] hover:border-[#7aa5d8] bg-[#f8fafc]'}
          ${value ? 'aspect-video' : 'h-32'}`}
      >
        {value ? (
          <>
            <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Change Image"
              >
                <Upload className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                title="Remove Image"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#5e6b78] hover:text-[#13202a]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm font-medium">Uploading... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <div className="p-3 bg-white border border-[#e3e8ee] rounded-full group-hover:bg-[#eef4fb] transition-colors">
                  <Upload className="w-6 h-6 text-[#1f4f82]" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-bold">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#7a8794]">PNG, JPG, WEBP up to 5MB</p>
                </div>
              </>
            )}
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};

export default ImageUploader;
