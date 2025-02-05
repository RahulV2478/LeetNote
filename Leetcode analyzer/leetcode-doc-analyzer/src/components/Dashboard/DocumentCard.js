// src/components/DocumentCard.js
import React from 'react';

const DocumentCard = ({ doc, onDelete, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-1 p-4"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 truncate">{doc.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow transition-colors"
          title="Delete Document"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a1 1 0 011 1v1H9V4a1 1 0 011-1z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
