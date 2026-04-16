import { useState } from 'react';
import { X, ImagePlus, Upload } from 'lucide-react';
import API from '../api/axios';

const ImageUploader = ({ images, setImages }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = async (files) => {
    const remaining = 3 - images.length;
    if (remaining <= 0) return;

    const selected = Array.from(files).slice(0, remaining);
    setUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < selected.length; i++) {
        formData.append('images', selected[i], selected[i].name);
      }

      const { data } = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const received = data.images || data.urls || [];
      setImages(prev => [...prev, ...received]);

    } catch (err) {
      console.log('Upload error:', err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) uploadFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files);
  };

  const handleRemove = async (index) => {
    const img = images[index];
    try {
      // delete from cloudinary
      await API.delete('/upload', { data: { publicId: img.publicId } });
    } catch (err) {
      console.log('Could not delete from cloudinary:', err.message);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="sm:col-span-2 flex flex-col gap-3">

      {/* Label */}
      <label className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        Product Images{' '}
        <span className="text-gray-400">({images.length}/3)</span>
      </label>

      {/* Upload zone + previews side by side */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* Tiny preview boxes */}
        {images.map((img, index) => (
          <div key={index} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
            <img
              src={img.url}  
              alt={`img-${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
            >
              <X size={14} className="text-white" />
            </button>
            {index === 0 && (
              <span className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[9px] px-1 rounded font-medium leading-4">
                Main
              </span>
            )}
          </div>
        ))}

        {/* Empty slot placeholders */}
        {images.length < 3 && [...Array(3 - images.length)].map((_, i) => (
          <div
            key={`empty-${i}`}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0"
          >
            <Upload size={14} className="text-gray-300 dark:text-gray-600" />
          </div>
        ))}

        {/* Upload button */}
        {images.length < 3 && (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`relative w-16 h-16 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-0.5 transition flex-shrink-0 ${
              dragOver
                ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-red-400 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ImagePlus size={16} className="text-red-400" />
                <span className="text-[9px] text-gray-400 leading-tight text-center">
                  Upload
                </span>
              </>
            )}
          </label>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-400">
        PNG, JPG, WEBP · max 5MB each · up to 3 images
      </p>
    </div>
  );
};

export default ImageUploader;