const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Get questions by subject ID
export const getQuestionsBySubject = async (subjectId) => {
  try {
    const response = await fetch(`${API_URL}/forum/subject/${subjectId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions by subject');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching questions by subject:', error);
    throw error;
  }
};

// Get a single question and its answers
export const getQuestionWithAnswers = async (questionId) => {
  try {
    const response = await fetch(`${API_URL}/forum/question/${questionId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch question with answers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching question with answers:', error);
    throw error;
  }
};

// Create a new question
export const createQuestion = async (subjectId, title, content) => {
  try {
    const response = await fetch(`${API_URL}/forum/question`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subjectId, title, content }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create question');
    }

    return data;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// Create a new answer
export const createAnswer = async (questionId, content) => {
  try {
    const response = await fetch(`${API_URL}/forum/question/${questionId}/answer`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create answer');
    }

    return data;
  } catch (error) {
    console.error('Error creating answer:', error);
    throw error;
  }
};

// Delete a question
export const deleteQuestion = async (questionId) => {
  try {
    const response = await fetch(`${API_URL}/forum/question/${questionId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete question');
    }

    return data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

// Delete an answer
export const deleteAnswer = async (answerId) => {
  try {
    const response = await fetch(`${API_URL}/forum/answer/${answerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete answer');
    }

    return data;
  } catch (error) {
    console.error('Error deleting answer:', error);
    throw error;
  }
}; 