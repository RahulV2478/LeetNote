// src/components/Dashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDocuments from '../../hooks/useDocuments';
import DocumentCard from './DocumentCard';
import NewDocumentModal from './NewDocumentModal';

const Dashboard = () => {
  const navigate = useNavigate();
  // Custom hook managing documents, loading, error, fetchDocuments, deleteDocument
  const { documents, loading, error, fetchDocuments, deleteDocument } = useDocuments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');

  // Open New Document modal
  const handleNewDocument = () => {
    setNewDocTitle('');
    setShowNewDocModal(true);
  };

  // Create a new document using the API and close the modal
  const handleCreateDocument = async (e) => {
    e.preventDefault();
    const title = newDocTitle.trim() || `Document ${documents.length + 1}`;
    console.log("Creating document with title:", title);

    // Retrieve token for protected route calls
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5001/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create document");
      }
      const data = await response.json();
      console.log("Document created successfully:", data);
      // Refresh documents list and navigate to the new document's editor
      fetchDocuments();
      setShowNewDocModal(false);
      navigate(`/editor/${data.id}`);
    } catch (err) {
      console.error("Error creating document", err);
    }
  };

  // Filter documents based on search term
  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-row pt-12 bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4 h-screen fixed left-0 top-0">
        <input
          type="text"
          placeholder="Search documents..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 w-full"
          onClick={handleNewDocument}
        >
          + New Document
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Documents</h2>
        {loading && <p>Loading documents...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredDocs.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onDelete={() => deleteDocument(doc.id)}
              onClick={() => navigate(`/editor/${doc.id}`)}
            />
          ))}
        </div>
      </main>

      {/* New Document Modal */}
      {showNewDocModal && (
        <NewDocumentModal
          newDocTitle={newDocTitle}
          setNewDocTitle={setNewDocTitle}
          handleCreateDocument={handleCreateDocument}
          handleCloseModal={() => setShowNewDocModal(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
