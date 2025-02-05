import React, { useState } from "react";
import CollapsibleCard from "../Common/CollapsibleCard";
import CodeEditor from "./CodeEditor";
import SectionCard from "../Common/SectionCard";
import Spinner from "../Common/Spinner";

const CodeBlockCard = ({ block, onUpdateBlock, analyzeBlockCode, generateBlockHint }) => {
  // Local state for block data
  const [blockLanguage, setBlockLanguage] = useState(block.language || "");
  const [blockCode, setBlockCode] = useState(block.code || "");
  const [blockAnalysis, setBlockAnalysis] = useState(block.analysis || null);
  const [blockHint, setBlockHint] = useState(block.hint || null);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState(null);

  // Save changes to the backend
  const handleSaveBlock = async () => {
    try {
      setBlockLoading(true);
      setBlockError(null);
      const updates = {
        language: blockLanguage,
        code: blockCode,
        analysis: blockAnalysis && typeof blockAnalysis !== "string"
          ? JSON.stringify(blockAnalysis)
          : blockAnalysis,
        hint: blockHint,
      };
      await onUpdateBlock(block.id, updates);
    } catch (err) {
      setBlockError(err.message);
      console.error("Error saving block:", err);
    } finally {
      setBlockLoading(false);
    }
  };

  // Analyze this block's code
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

  // Generate hint for this block
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
    <CollapsibleCard title={`Block #${block.id}`}>
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
        <CodeEditor code={blockCode} setCode={setBlockCode} />
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
      <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-[500px] overflow-y-auto space-y-4">
        {Array.isArray(blockAnalysis) && blockAnalysis.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-indigo-600">Analysis Result:</h3>
            {blockAnalysis.map((sec, index) => (
              <SectionCard key={index} title={sec.title} content={sec.content} />
            ))}
          </>
        ) : blockAnalysis ? (
          <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
            <p className="text-red-600 font-semibold">Unexpected analysis format received.</p>
            <pre className="bg-gray-100 p-4 rounded-md">{JSON.stringify(blockAnalysis, null, 2)}</pre>
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
  );
};

export default CodeBlockCard;
