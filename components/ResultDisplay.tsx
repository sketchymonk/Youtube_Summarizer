import React from 'react';
import { RefreshCcw, ArrowLeft } from 'lucide-react';
import { SimpleMarkdown } from './SimpleMarkdown';

interface ResultDisplayProps {
  markdown: string;
  onReset: () => void;
  onResummarize: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ markdown, onReset, onResummarize }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in pb-32">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-10">
           <SimpleMarkdown content={markdown} />
        </div>
        
        <div className="bg-gray-50 p-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 font-medium mb-6">
            Would you like to summarize another YouTube video or re-summarize this one with new options?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onResummarize}
              className="px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCcw size={18} />
              Adjust Options
            </button>
            <button
              onClick={onReset}
              className="px-6 py-3 bg-yt-black text-white rounded-xl font-medium hover:bg-gray-800 shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              New Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
