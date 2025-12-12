import React, { useCallback, useState } from 'react';
import { UploadCloud, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndSelectFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError("File size exceeds 50MB limit.");
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-10 transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center cursor-pointer
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <UploadCloud className="w-8 h-8 text-blue-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-slate-800 mb-2">
          {isDragging ? "Drop your PDF here" : "Click to upload or drag and drop"}
        </h3>
        <p className="text-slate-500 mb-6">
          PDF up to 50MB
        </p>

        {error && (
          <div className="flex items-center text-red-500 bg-red-50 px-4 py-2 rounded-lg mt-2 animate-pulse">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;