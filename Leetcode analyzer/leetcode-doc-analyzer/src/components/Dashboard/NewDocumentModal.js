// src/components/NewDocumentModal.js
import React from 'react';

const NewDocumentModal = ({ newDocTitle, setNewDocTitle, handleCreateDocument, handleCloseModal }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Modal overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleCloseModal}
      ></div>
      {/* Modal content */}
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 w-96">
        <h3 className="text-2xl font-bold mb-4">New Document</h3>
        <form onSubmit={handleCreateDocument}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="docTitle">
              Problem Name
            </label>
            <input
              type="text"
              id="docTitle"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              placeholder="Enter problem name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDocumentModal;
