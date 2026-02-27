import React from 'react';

interface Props {
  imagePreview: string;
  onChange: (file: File) => void;
}

export const ImageUploader: React.FC<Props> = ({ imagePreview, onChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">Hotel Image</label>
      <input type="file" onChange={handleFileChange} className="w-full px-4 py-3 border rounded-xl" />
      {imagePreview && (
        <img
          src={imagePreview.startsWith('data:') ? imagePreview : `data:image/jpeg;base64,${imagePreview}`}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-lg mt-2"
        />
      )}
    </div>
  );
};

export default ImageUploader;