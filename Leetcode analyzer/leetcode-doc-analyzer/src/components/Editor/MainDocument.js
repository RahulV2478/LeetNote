// src/components/Editor/MainDocument.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DraggableCodeBlockCard from "./DraggableCodeBlockCard";

/**
 * Example: If your codeblock data in the DB includes { position: { x: number, y: number }, ... },
 * we'll render them absolutely via DraggableCodeBlockCard.
 */
const MainDocument = () => {
  const { id } = useParams();

  const [codeBlocks, setCodeBlocks] = useState([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [errorBlocks, setErrorBlocks] = useState(null);

  // Retrieve token for authorization
  const token = localStorage.getItem("token");

  // Fetch code blocks for this document
  useEffect(() => {
    const fetchCodeBlocks = async () => {
      if (!id) return;
      setLoadingBlocks(true);
      setErrorBlocks(null);
      try {
        const response = await fetch(`http://localhost:5001/codeblocks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch code blocks.");
        }
        const data = await response.json();
        setCodeBlocks(data.codeblocks || []);
      } catch (err) {
        setErrorBlocks(err.message);
        console.error("Error fetching code blocks:", err);
      } finally {
        setLoadingBlocks(false);
      }
    };

    fetchCodeBlocks();
  }, [id, token]);

  // Update a code block on the backend (including its position if needed)
  const updateCodeBlock = async (blockId, updates) => {
    try {
      const response = await fetch(`http://localhost:5001/codeblocks/${blockId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to update code block.");
      }
    } catch (err) {
      console.error("Error updating code block:", err);
    }
  };

  // Example: If you want to re-fetch the entire list after an update
  const refetchBlocks = async () => {
    setLoadingBlocks(true);
    setErrorBlocks(null);
    try {
      const response = await fetch(`http://localhost:5001/codeblocks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch code blocks.");
      }
      const data = await response.json();
      setCodeBlocks(data.codeblocks || []);
    } catch (err) {
      setErrorBlocks(err.message);
    } finally {
      setLoadingBlocks(false);
    }
  };

  // For code analysis
  const analyzeBlockCode = async ({ code, language }) => {
    const problemName = "LeetCode Problem"; // or retrieve from doc
    const response = await fetch("http://localhost:5001/analyze-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, problemName, language }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to analyze code.");
    }
    const data = await response.json();
    return data.analysis; // array
  };

  // For hint generation
  const generateBlockHint = async ({ code, language }) => {
    const problemName = "LeetCode Problem";
    const response = await fetch("http://localhost:5001/generate-hint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code, problemName, language }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to generate hint.");
    }
    const data = await response.json();
    return data.hint;
  };

  if (loadingBlocks) return <p>Loading code blocks...</p>;
  if (errorBlocks) return <p className="text-red-500">{errorBlocks}</p>;

  return (
    <div className="relative w-screen h-screen bg-gray-100 overflow-auto">
      {/* 
        Each DraggableCodeBlockCard is absolutely positioned
        and can be dragged around. 
      */}
      {codeBlocks.map((block) => (
        <DraggableCodeBlockCard
          key={block.id}
          block={block}
          onUpdateBlock={updateCodeBlock}
          analyzeBlockCode={analyzeBlockCode}
          generateBlockHint={generateBlockHint}
          // After each position update or code update, 
          // you can call refetchBlocks() if you want the UI in sync
          // or rely on local state updates:
          onPositionChange={(newPos) => {
            // optional: Save the new position to the backend
            updateCodeBlock(block.id, { position: newPos });
          }}
        />
      ))}
    </div>
  );
};

export default MainDocument;
