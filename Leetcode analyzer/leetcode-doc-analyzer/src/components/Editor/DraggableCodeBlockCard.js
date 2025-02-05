// src/components/Editor/DraggableCodeBlockCard.js
import React, { useState, useRef } from "react";
import CollapsibleCard from "../Common/CollapsibleCard";
import CodeEditor from "./CodeEditor";
import SectionCard from "../Common/SectionCard";
import Spinner from "../Common/Spinner";

// Re-implement from snippet:
export const setZIndex = (selectedCard) => {
  // Bring the focused card to the top
  selectedCard.style.zIndex = 999;

  // Put all other .card elements below
  Array.from(document.getElementsByClassName("card")).forEach((card) => {
    if (card !== selectedCard) {
      card.style.zIndex = 998;
    }
  });
};

export function autoGrow(textAreaRef) {
  const { current } = textAreaRef;
  if (!current) return;
  current.style.height = "auto";
  current.style.height = current.scrollHeight + "px";
}

// From snippet: calculates new offset based on the old offset minus the mouse delta
export const setNewOffset = (cardEl, mouseMoveDir = { x: 0, y: 0 }) => {
  const offsetLeft = cardEl.offsetLeft - mouseMoveDir.x;
  const offsetTop = cardEl.offsetTop - mouseMoveDir.y;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

const DraggableCodeBlockCard = ({
  block,
  onUpdateBlock,
  analyzeBlockCode,
  generateBlockHint,
  onPositionChange,
}) => {
  // Store the position from block data or default to (100, 100)
  const initialPos = (block.position && block.position.x !== undefined)
    ? block.position
    : { x: 100, y: 100 };
  const [position, setPosition] = useState(initialPos);

  const [blockLanguage, setBlockLanguage] = useState(block.language || "");
  const [blockCode, setBlockCode] = useState(block.code || "");
  const [blockAnalysis, setBlockAnalysis] = useState(block.analysis || null);
  const [blockHint, setBlockHint] = useState(block.hint || null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState(null);

  // Refs for dragging
  const cardRef = useRef(null);
  const mouseStartPos = useRef({ x: 0, y: 0 });

  // DRAG HANDLERS
  const handleMouseDown = (e) => {
    if (!cardRef.current) return;

    // Bring this card to the top
    setZIndex(cardRef.current);

    mouseStartPos.current.x = e.clientX;
    mouseStartPos.current.y = e.clientY;

    // Listen globally
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const deltaX = mouseStartPos.current.x - e.clientX;
    const deltaY = mouseStartPos.current.y - e.clientY;

    mouseStartPos.current.x = e.clientX;
    mouseStartPos.current.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, { x: deltaX, y: deltaY });
    setPosition(newPosition);

    // Notify parent that position changed (if you want to persist it)
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  const handleMouseUp = () => {
    // Stop listening globally
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Save changes to the backend (language, code, analysis, hint)
  const handleSaveBlock = async () => {
    try {
      setBlockLoading(true);
      setBlockError(null);
      const updates = {
        language: blockLanguage,
        code: blockCode,
        analysis:
          blockAnalysis && typeof blockAnalysis !== "string"
            ? JSON.stringify(blockAnalysis)
            : blockAnalysis,
        hint: blockHint,
        // Optionally, save position too:
        position,
      };
      await onUpdateBlock(block.id, updates);
    } catch (err) {
      setBlockError(err.message);
      console.error("Error saving block:", err);
    } finally {
      setBlockLoading(false);
    }
  };

  // Analyze code
  const handleAnalyze = async () => {
    setBlockLoading(true);
    setBlockError(null);
    setBlockAnalysis(null);
    try {
      const result = await analyzeBlockCode({
        code: blockCode,
        language: blockLanguage,
      });
      setBlockAnalysis(result);
    } catch (err) {
      setBlockError(err.message);
      console.error("Error analyzing block code:", err);
    } finally {
      setBlockLoading(false);
    }
  };

  // Generate hint
  const handleGenerateHint = async () => {
    setBlockLoading(true);
    setBlockError(null);
    setBlockHint(null);
    try {
      const hintResult = await generateBlockHint({
        code: blockCode,
        language: blockLanguage,
      });
      setBlockHint(hintResult);
    } catch (err) {
      setBlockError(err.message);
      console.error("Error generating hint:", err);
    } finally {
      setBlockLoading(false);
    }
  };

  return (
    <div
      className="card absolute" // key for setZIndex to find it
      ref={cardRef}
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* 
        On mousedown over the top bar (or entire card), we start dragging.
        You could apply this to a "drag handle" only if desired.
      */}
      <div
        onMouseDown={handleMouseDown}
        className="cursor-move bg-gray-300 p-2 rounded-t"
      >
        {/* Title or Card Header */}
        <span className="font-semibold">Block #{block.id}</span>
      </div>

      <CollapsibleCard
        // If your CollapsibleCard has its own wrapper, you can pass children
        title=""
      >
        {/* Language Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Programming Language
          </label>
          <select
            value={blockLanguage}
            onChange={(e) => setBlockLanguage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Language</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Ruby">Ruby</option>
            <option value="Go">Go</option>
            <option value="TypeScript">TypeScript</option>
          </select>
        </div>

        {/* Code Editor */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Code
          </label>
          <CodeEditor
            code={blockCode}
            setCode={setBlockCode}
            // If you want autoGrow logic for a textarea, you'd attach a ref 
            // and call autoGrow on change
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 flex items-center"
            onClick={handleGenerateHint}
            disabled={blockLoading}
          >
            {blockLoading ? <Spinner /> : "Generate Hint"}
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 flex items-center"
            onClick={handleAnalyze}
            disabled={blockLoading}
          >
            {blockLoading ? <Spinner /> : "Analyze Code"}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 flex items-center"
            onClick={handleSaveBlock}
            disabled={blockLoading}
          >
            Save Block
          </button>
        </div>

        {/* Analysis */}
        <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-[300px] overflow-y-auto space-y-4">
          {Array.isArray(blockAnalysis) && blockAnalysis.length > 0 ? (
            <>
              <h3 className="text-lg font-semibold text-indigo-600">
                Analysis Result:
              </h3>
              {blockAnalysis.map((sec, index) => (
                <SectionCard key={index} title={sec.title} content={sec.content} />
              ))}
            </>
          ) : blockAnalysis ? (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-red-600 font-semibold">
                Unexpected analysis format received.
              </p>
              <pre className="bg-gray-100 p-4 rounded-md">
                {JSON.stringify(blockAnalysis, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>

        {/* Hint */}
        {blockHint && (
          <div className="mt-4">
            <SectionCard title="Hint" content={blockHint} />
          </div>
        )}

        {/* Error Message */}
        {blockError && <p className="text-red-600 mt-4">{blockError}</p>}
      </CollapsibleCard>
    </div>
  );
};

export default DraggableCodeBlockCard;