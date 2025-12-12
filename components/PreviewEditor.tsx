import React from 'react';
import { FileText, Download, RotateCcw } from 'lucide-react';

interface PreviewEditorProps {
  content: string;
  onChange: (value: string) => void;
  onDownload: () => void;
  onReset: () => void;
  isGenerating: boolean;
}

const PreviewEditor: React.FC<PreviewEditorProps> = ({ 
  content, 
  onChange, 
  onDownload, 
  onReset,
  isGenerating 
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Review & Edit</h3>
            <p className="text-xs text-slate-500">Edit the AI-extracted text before saving</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start Over
          </button>
          
          <button
            onClick={onDownload}
            disabled={isGenerating}
            className={`
              flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all
              ${isGenerating 
                ? 'bg-blue-400 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            <Download className="w-4 h-4" />
            {isGenerating ? 'Generating Word...' : 'Download Word Doc'}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative">
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-8 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 font-mono text-sm leading-relaxed text-slate-800"
          placeholder="Extracted content will appear here..."
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-400 pointer-events-none bg-white/80 backdrop-blur px-2 py-1 rounded">
          Markdown Supported
        </div>
      </div>
    </div>
  );
};

export default PreviewEditor;