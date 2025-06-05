const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

// Get all subjects
export const getSubjects = async () => {
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