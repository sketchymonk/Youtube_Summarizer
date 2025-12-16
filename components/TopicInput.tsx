import React, { useState } from 'react';
import { MessageSquare, ArrowRight } from 'lucide-react';

interface TopicInputProps {
  videoTitle: string;
  onSubmit: (topic: string) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({ videoTitle, onSubmit }) => {
  const [topic, setTopic] = useState('');

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-6 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
             <MessageSquare className="text-yellow-600 w-6 h-6 mt-1 shrink-0" />
             <div>
                <h3 className="font-bold text-yellow-900 text-lg mb-1">Specific Topic Required</h3>
                <p className="text-yellow-700 text-sm">
                  You selected <strong>Option 5</strong> for <em>"{videoTitle}"</em>. 
                  What specific topic would you like me to focus on?
                </p>
             </div>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            autoFocus
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. The marketing strategies mentioned..."
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-yt-black focus:ring-0 outline-none transition-colors shadow-sm"
          />
          <button
            onClick={() => topic.trim() && onSubmit(topic.trim())}
            disabled={!topic.trim()}
            className={`absolute right-2 top-2 bottom-2 px-6 rounded-lg flex items-center font-medium transition-all
              ${!topic.trim() ? 'bg-gray-100 text-gray-400' : 'bg-yt-black text-white hover:bg-gray-800'}`}
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
