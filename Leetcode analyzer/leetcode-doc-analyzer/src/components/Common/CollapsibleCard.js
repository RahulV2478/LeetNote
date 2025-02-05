import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const CollapsibleCard = ({ title, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Rnd
      default={{
        x: 100, // Initial X position
        y: 100, // Initial Y position
        width: '60vw', // Default width
        height: isCollapsed ? '50px' : 'auto', // Height changes based on collapse state
      }}
      minWidth={300}
      minHeight={50}
      maxWidth="100vw"
      maxHeight="100vh"
      bounds="window" // Prevent card from moving outside the window
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      className="bg-white rounded-lg shadow-xl transition-all duration-300 ease-in-out"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-gray-300 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 focus:outline-none"
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && <div className="p-6">{children}</div>}
    </Rnd>
  );
};

export default CollapsibleCard;
