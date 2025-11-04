import UploadZone from '../UploadZone';
import { useState } from 'react';

export default function UploadZoneExample() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  return (
    <div className="h-[600px]">
      <UploadZone
        onImageSelect={(file, preview) => {
          console.log('Image selected:', file.name);
          setSelectedImage(preview);
        }}
        selectedImage={selectedImage}
        onClearImage={() => {
          console.log('Image cleared');
          setSelectedImage(null);
        }}
        isProcessing={false}
      />
    </div>
  );
}
