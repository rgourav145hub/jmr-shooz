import React, { useState, useEffect } from 'react';
import { UploadCloud, Loader2 } from 'lucide-react';

export default function ImageUploader({ onUploadSuccess, buttonText = "Upload Image", currentImage = null }) {
  const [isUploading, setIsUploading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Cloudinary widget script
    const scriptId = 'cloudinary-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  const handleUpload = () => {
    if (!isLoaded || typeof window.cloudinary === 'undefined') {
      alert('Upload widget is still loading. Please try again in a moment.');
      return;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName || cloudName === 'your-cloud-name') {
      alert('Cloudinary is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in .env');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: 'jmr_shooz_uploads',
        sources: ['local', 'url', 'camera'],
        multiple: false,
        maxFiles: 1,
        theme: 'minimal'
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setIsUploading(false);
          if (onUploadSuccess) {
            onUploadSuccess(result.info.secure_url);
          }
        } else if (error) {
          setIsUploading(false);
          console.error('Upload Error:', error);
        }
      }
    );

    setIsUploading(true);
    widget.open();
  };

  return (
    <div className="w-full">
      {currentImage && (
        <div className="mb-3 relative rounded-lg overflow-hidden border border-brand-border bg-brand-dark/50 aspect-video max-h-32 flex items-center justify-center">
          <img src={currentImage} alt="Current" className="max-h-full max-w-full object-contain" />
        </div>
      )}
      <button
        type="button"
        onClick={handleUpload}
        disabled={!isLoaded || isUploading}
        className="w-full py-2.5 px-4 rounded-xl border border-dashed border-brand-gold/40 hover:border-brand-gold bg-brand-gold/5 hover:bg-brand-gold/10 text-brand-gold text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            <span>{buttonText}</span>
          </>
        )}
      </button>
    </div>
  );
}
