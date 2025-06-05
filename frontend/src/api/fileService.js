import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configure axios
axios.defaults.withCredentials = true;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Get all subjects
export const getAllSubjects = async () => {
    try {
    const response = await fetch(`${API_URL}/subjects`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch subjects');
    }
    
    return await response.json();
    } catch (error) {
    console.error('Error fetching subjects:', error);
      throw error;
    }
};

// Get files by subject
export const getFilesBySubject = async (subjectName) => {
  try {
    const response = await fetch(`${API_URL}/files/subject?subject=${encodeURIComponent(subjectName)}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
};

// Upload a file
export const uploadFile = async (file, subject, title, fileType) => {
  try {
      const formData = new FormData();
      formData.append('file', file);
    formData.append('subject', subject);
      formData.append('title', title);
      formData.append('fileType', fileType);

    const response = await fetch(`${API_URL}/files/upload`, {
      method: 'POST',
        headers: {
        ...getAuthHeaders(),
      },
      body: formData
      });
      
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload file');
    }
    
    return data;
    } catch (error) {
      console.error('Error uploading file:', error);
    throw new Error(error.message || 'Failed to upload file');
  }
};

// Get file URL
export const getFileUrl = (storedFileName) => {
  if (!storedFileName) {
    throw new Error('File name is required');
  }
  return `${API_URL}/files/${encodeURIComponent(storedFileName)}`;
};

// Delete a file
export const deleteFile = async (fileId) => {
  try {
    const response = await fetch(`${API_URL}/files/${fileId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete file');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting file:', error);
      throw error;
    }
};

// Toggle favorite status
export const toggleFavorite = async (fileId) => {
  try {
    const response = await fetch(`${API_URL}/files/${fileId}/favorite`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to toggle favorite status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// Get user's uploaded files
export const getUserUploads = async () => {
    try {
    const response = await fetch(`${API_URL}/files/myuploads`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user uploads');
    }
    
    return await response.json();
    } catch (error) {
    console.error('Error getting user uploads:', error);
      throw error;
    }
};

// Get user's favorite files
export const getUserFavorites = async () => {
  try {
    const response = await fetch(`${API_URL}/files/favorites`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};
  
  // Get all files
export const getAllFiles = async () => {
    try {
    const response = await fetch(`${API_URL}/files/all`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch all files');
    }
    return await response.json();
    } catch (error) {
      console.error('Error fetching all files:', error);
      throw error;
  }
};