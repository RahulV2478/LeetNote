import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';

const languageExtensions = {
  javascript: javascript(),
  python: python(),
  cpp: cpp(),
};

const CodeEditor = ({ code, setCode }) => {
  const [language, setLanguage] = React.useState('javascript');

  return (
    <div className="w-full bg-gray-50 border border-gray-300 rounded-lg shadow-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Code</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      <CodeMirror
        value={code}
        height="300px"
        extensions={[languageExtensions[language] || javascript()]}
        onChange={(value) => setCode(value)}
        className="text-sm"
      />
    </div>
  );
};

export default CodeEditor;
