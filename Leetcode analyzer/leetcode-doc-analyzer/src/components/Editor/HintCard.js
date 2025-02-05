import React, { useState } from 'react';

const HintCard = ({ closeCard }) => {
  const [hintText, setHintText] = useState('');
  const [hintType, setHintType] = useState('thought');

  const handleSubmitHint = () => {
    if (!hintText.trim()) {
      alert('Please enter a hint.');
      return;
    }
    alert(`Hint Submitted!\nType: ${hintType}\nText: ${hintText}`);
    closeCard();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-300 mt-2 w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Add a Hint</h3>
      {/* Hint Type Dropdown */}
      <label htmlFor="hintType" className="block text-sm font-medium text-gray-700 mb-1">
        Hint Type
      </label>
      <select
        id="hintType"
        value={hintType}
        onChange={(e) => setHintType(e.target.value)}
        className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="thought">Thought Process</option>
        <option value="algorithm">Algorithms & Data Structures</option>
        <option value="syntax">Syntax</option>
      </select>

      {/* Hint Text Input */}
      <label htmlFor="hintText" className="block text-sm font-medium text-gray-700 mb-1">
        Hint Text
      </label>
      <textarea
        id="hintText"
        value={hintText}
        onChange={(e) => setHintText(e.target.value)}
        placeholder="Write your hint here..."
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
        rows={3}
      ></textarea>

      {/* Submit and Cancel Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={closeCard}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={handleSubmitHint}
        >
          Submit Hint
        </button>
      </div>
    </div>
  );
};

export default HintCard;
