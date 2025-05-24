// src/api/apiService.js
const API_BASE = 'http://localhost:8080/eduinpt-backend/api';

export const fetchData = async () => {
  const res = await fetch(`${API_BASE}/data`);
  return await res.json();
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/upload`, { 
    method: 'POST', 
    body: formData 
  });
  return await res.text();
};

