// src/hooks/useDocuments.js
import { useState, useEffect } from 'react';

const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      // Include the token in the Authorization header
      const response = await fetch("http://localhost:5001/documents", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data.documents);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const deleteDocument = async (id) => {
    // Similar approach: include token in headers
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      const response = await fetch(`http://localhost:5001/documents/${id}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete document");
      }
      // Optionally refetch documents after deletion
      fetchDocuments();
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  return { documents, loading, error, fetchDocuments, deleteDocument };
};

export default useDocuments;
