import React, { useState } from 'react';
import { Search, Youtube } from 'lucide-react';

interface UrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  error?: string | null;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, isLoading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 animate-fade-in-up">
      <div className="bg-white p-4 rounded-full shadow-lg mb-6 animate-bounce">
        <Youtube size={48} className="text-yt-red" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
        YouTube Summarizer
      </h1>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        Paste a YouTube URL below to get started. I'll ask you how you want it summarized.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-lg relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-yt-red transition-colors" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={isLoading}
            className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl 
                       text-gray-900 placeholder-gray-400 focus:outline-none focus:border-yt-red 
                       focus:ring-4 focus:ring-yt-red/10 transition-all shadow-sm text-lg"
          />
          <button
            type="submit"
            disabled={!url || isLoading}
            className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl font-medium text-white transition-all
              ${!url || isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-yt-red hover:bg-yt-hover shadow-md active:scale-95'}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Start'
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-red-500 text-sm text-center font-medium bg-red-50 py-2 px-4 rounded-lg border border-red-100">
            {error}
          </p>
        )}
      </form>
    </div>
  );
};
