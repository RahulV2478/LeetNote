// src/components/SectionCard.js
import React from 'react';

const SectionCard = ({ title, content }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2 text-indigo-600">{title}</h3>
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
    </div>
  );
};

export default SectionCard;
