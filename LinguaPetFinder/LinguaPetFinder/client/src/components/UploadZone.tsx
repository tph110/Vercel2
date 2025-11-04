import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

interface UploadZoneProps {
  onImageSelect: (file: File, preview: string) => void;
  selectedImage: string | null;
  onClearImage: () => void;
  isProcessing: boolean;
}

export default function UploadZone({ 
  onImageSelect, 
  selectedImage, 
  onClearImage,
  isProcessing 
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = e.target?.result as string;
      onImageSelect(file, preview);
    };
    reader.readAsDataURL(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (selectedImage) {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-6">
        <div className="relative max-w-full max-h-full">
          <img 
            src={selectedImage} 
            alt="Uploaded dermatoscope" 
            className="max-w-full max-h-[500px] rounded-lg border border-card-border"
            data-testid="img-uploaded-preview"
          />
          {!isProcessing && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={onClearImage}
              data-testid="button-clear-image"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div
        className={`w-full max-w-md border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center gap-4 transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover-elevate'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="zone-upload"
      >
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
          <Upload className="h-12 w-12 text-muted-foreground" data-testid="icon-upload" />
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-upload-title">
            Upload Dermatoscope Image
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-upload-description">
            Drag and drop your image here, or click to browse
          </p>
        </div>

        <Button 
          onClick={handleBrowseClick}
          data-testid="button-browse-files"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Browse Files
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-file-upload"
        />

        <div className="text-xs text-muted-foreground text-center mt-2">
          <p data-testid="text-supported-formats">Supported: JPG, PNG, JPEG</p>
          <p data-testid="text-max-size">Max size: 10MB</p>
        </div>
      </div>
    </div>
  );
}
