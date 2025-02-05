// src/hooks/useWorkspace.js
import { useState, useRef } from 'react';

const useWorkspace = () => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const workspaceRef = useRef(null);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDirection = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + zoomDirection)));
  };

  const handleMouseDown = (e) => {
    if (["INPUT", "BUTTON", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const initial = { ...position };

    const handleMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPosition({ x: initial.x + dx, y: initial.y + dy });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return { zoom, position, workspaceRef, handleWheel, handleMouseDown };
};

export default useWorkspace;
