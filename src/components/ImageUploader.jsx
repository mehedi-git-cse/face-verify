import { useRef, useState } from 'react';
import { Upload, Image, X } from 'lucide-react';

export default function ImageUploader({ onImageSelect, disabled }) {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onImageSelect(file, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {!preview ? (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-10 text-center
            transition-all duration-300 cursor-pointer group
            ${isDragging 
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20' 
              : 'border-slate-300 dark:border-slate-600 hover:border-violet-400 hover:bg-violet-50/70 dark:hover:bg-violet-900/10'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* Animated background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className={`absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 transition-opacity duration-300 
              ${isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </div>
          
          <div className="relative flex flex-col items-center gap-4">
            <div className={`p-4 rounded-2xl transition-all duration-300 
              ${isDragging ? 'bg-violet-100 dark:bg-violet-900/50 scale-110' : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/50 group-hover:scale-105'}`}>
              <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-violet-600' : 'text-slate-500 group-hover:text-violet-600'}`} />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Drop your image here
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                or click to browse from your device
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
              <span className="text-xs text-slate-500 dark:text-slate-400">Supports:</span>
              <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">JPG, PNG, WEBP</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg bg-white dark:bg-slate-800">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-contain bg-slate-50 dark:bg-slate-700"
            />
            <button
              onClick={clearImage}
              disabled={disabled}
              className={`
                absolute top-3 right-3 p-2.5 bg-red-500/90 backdrop-blur-sm text-white rounded-xl
                shadow-lg hover:bg-red-500 transition-all hover:scale-105
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <X className="w-4 h-4" />
            </button>
            
            {/* Ready badge */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-semibold rounded-lg flex items-center gap-1.5">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Ready
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Image className="w-4 h-4 text-violet-500" />
            <span>Image ready for verification</span>
          </div>
        </div>
      )}
    </div>
  );
}
