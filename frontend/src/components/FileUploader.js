// src/components/FileUploader.js
import { useState } from 'react';
import { uploadFile } from '../api/apiService';

function FileUploader() {
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const result = await uploadFile(file);
    setMessage(result);
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <p>{message}</p>
    </div>
  );
}
