import React from 'react';
import { Check, X, PlayCircle } from 'lucide-react';

interface ConfirmationProps {
  title: string;
  videoId?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ title, videoId, onConfirm, onCancel }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex flex-col items-center">
            {videoId ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm mb-4 group">
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                  alt="Video Thumbnail" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if image fails
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement?.classList.add('hidden');
                  }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            ) : (
              <PlayCircle className="text-yt-red w-12 h-12 mb-4" />
            )}
            
            <h2 className="text-xl font-bold text-gray-900 text-center leading-snug line-clamp-2">
              {title}
            </h2>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center mb-8">
            I've found this video. Is this the correct one you'd like me to summarize?
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <X size={20} />
              No, Retry
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-yt-red text-white font-medium hover:bg-yt-hover shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              <Check size={20} />
              Yes, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};