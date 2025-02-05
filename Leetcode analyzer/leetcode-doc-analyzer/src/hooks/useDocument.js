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
      const response = await fetch('http://localhost:5001/documents');
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
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

  const deleteDocument = async (docId) => {
    try {
      const response = await fetch(`http://localhost:5001/documents/${docId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (err) {
      console.error("Error deleting document:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return { documents, loading, error, fetchDocuments, deleteDocument };
};

export default useDocuments;
