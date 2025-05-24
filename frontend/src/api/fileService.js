import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Configure axios
axios.defaults.withCredentials = true;

const fileService = {
  // Get files for a specific subject
  getFilesBySubject: async (subjectName) => {
    try {
      console.log(`Fetching files for subject: ${subjectName}`);
      const response = await axios.get(`${API_URL}/files/subject/${encodeURIComponent(subjectName)}`);
      console.log('Files fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching files by subject:', error);
      throw error;
    }
  },

  // Upload a file for a subject
  uploadFile: async (file, subjectName, title, fileType) => {
    try {
      console.log(`Uploading file: ${title} for subject: ${subjectName}`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subjectName', subjectName);
      formData.append('title', title);
      formData.append('fileType', fileType);

      console.log('Form data created with file:', file.name);

      const response = await axios.post(`${API_URL}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  // Get the URL for a file
  getFileUrl: (storedFileName) => {
    return `${API_URL}/files/${storedFileName}`;
  },

  // Get all subjects
  getAllSubjects: async () => {
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  },
  
  // Get all files
  getAllFiles: async () => {
    try {
      const response = await axios.get(`${API_URL}/files/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all files:', error);
      throw error;
    }
  }
};

export default fileService; 