'use client';

import { useState } from 'react';
import { FaImage, FaUpload } from 'react-icons/fa';
import MediaGallery from './MediaGallery';
import Modal from './Modal';
import Button from './Button';

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const [showGallery, setShowGallery] = useState(false);

  const handleImageSelect = (imageUrl) => {
    onChange(imageUrl);
    setShowGallery(false);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Current Image Preview */}
      {value && (
        <div className="relative">
          <img
            src={value}
            alt="Selected image"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Select Image Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowGallery(true)}
        className="w-full flex items-center justify-center space-x-2"
      >
        <FaImage className="h-4 w-4" />
        <span>{value ? 'Change Image' : 'Select Image'}</span>
      </Button>

      {/* Media Gallery Modal */}
      <Modal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        title="Select Image"
        maxWidth="max-w-6xl"
      >
        <MediaGallery
          selectionMode={true}
          onSelect={handleImageSelect}
          onCancel={() => setShowGallery(false)}
        />
      </Modal>
    </div>
  );
}