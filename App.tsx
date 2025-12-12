import React, { useState } from 'react';
import { AppStatus } from './types';
import FileUpload from './components/FileUpload';
import PreviewEditor from './components/PreviewEditor';
import { extractContentFromPdf } from './services/geminiService';
import { generateAndDownloadDocx } from './utils/docxUtils';
import { Loader2, FileType, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setCurrentFile(file);
    setStatus(AppStatus.ANALYZING);
    setErrorMsg(null);

    try {
      const markdown = await extractContentFromPdf(file);
      setExtractedContent(markdown);
      setStatus(AppStatus.REVIEW);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during processing.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleDownload = async () => {
    if (!currentFile) return;
    
    try {
      setStatus(AppStatus.GENERATING_DOC);
      const outputFilename = currentFile.name.replace('.pdf', '.docx');
      await generateAndDownloadDocx(extractedContent, outputFilename);
      // Optional: Add a small delay so user sees the "Generating" state briefly
      setTimeout(() => setStatus(AppStatus.REVIEW), 800);
    } catch (err: any) {
      setErrorMsg("Failed to generate Word document.");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setExtractedContent('');
    setCurrentFile(null);
    setStatus(AppStatus.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileType className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              AI PDF to Word
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Intro Text */}
        {status === AppStatus.IDLE && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Convert PDF to Word with AI
            </h2>
            <p className="text-lg text-slate-600">
              Transform static PDFs into editable Word documents instantly. 
              Our AI preserves layout, headings, and tables better than traditional tools.
            </p>
          </div>
        )}

        {/* Upload State */}
        {status === AppStatus.IDLE && (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        {/* Processing State */}
        {status === AppStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-slate-800">Analyzing Document...</h3>
            <p className="mt-2 text-slate-500">Gemini AI is reading structure and extracting text.</p>
          </div>
        )}

        {/* Editor/Review State */}
        {(status === AppStatus.REVIEW || status === AppStatus.GENERATING_DOC) && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <PreviewEditor 
               content={extractedContent}
               onChange={setExtractedContent}
               onDownload={handleDownload}
               onReset={handleReset}
               isGenerating={status === AppStatus.GENERATING_DOC}
             />
          </div>
        )}

        {/* Error State */}
        {status === AppStatus.ERROR && (
          <div className="max-w-md mx-auto text-center py-12 bg-white rounded-xl shadow-sm border border-red-100 p-8">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Conversion Failed</h3>
            <p className="text-slate-500 mb-6">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Try Another File
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          Built with React, Gemini API, and Docx. Client-side processing only.
        </div>
      </footer>
    </div>
  );
};

export default App;