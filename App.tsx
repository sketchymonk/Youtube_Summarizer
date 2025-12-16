import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import { UrlInput } from './components/UrlInput';
import { Confirmation } from './components/Confirmation';
import { OptionSelector } from './components/OptionSelector';
import { TopicInput } from './components/TopicInput';
import { ResultDisplay } from './components/ResultDisplay';
import { fetchVideoTitle, generateVideoSummary, extractVideoId } from './services/geminiService';
import { Loader2 } from 'lucide-react';

function App() {
  const [state, setState] = useState<AppState>(AppState.INPUT);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [specificTopic, setSpecificTopic] = useState<string>('');
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async (inputUrl: string) => {
    // Robust ID extraction handles short URLs, embeds, and standard links
    const extractedId = extractVideoId(inputUrl);
    
    if (!extractedId) {
      setError("That URL doesn't appear to be a valid YouTube video.");
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      // We normalize to the canonical URL to ensure consistent backend processing
      const canonicalUrl = `https://www.youtube.com/watch?v=${extractedId}`;
      
      const title = await fetchVideoTitle(canonicalUrl);
      setVideoUrl(canonicalUrl);
      setVideoId(extractedId);
      setVideoTitle(title);
      setState(AppState.CONFIRM);
    } catch (err) {
      setError("Unable to fetch video details. Please check the URL.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    setState(AppState.OPTIONS);
  };

  const handleCancel = () => {
    setVideoUrl('');
    setVideoTitle('');
    setVideoId('');
    setState(AppState.INPUT);
  };

  const toggleOption = (id: number) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleOptionsNext = () => {
    if (selectedOptions.includes(5)) {
      setState(AppState.TOPIC_INPUT);
    } else {
      executeSummary();
    }
  };

  const handleTopicSubmit = (topic: string) => {
    setSpecificTopic(topic);
    executeSummary(topic);
  };

  const executeSummary = async (topic: string = specificTopic) => {
    setState(AppState.GENERATING);
    try {
      const result = await generateVideoSummary(videoUrl, videoTitle, selectedOptions, topic);
      setSummaryResult(result);
      setState(AppState.RESULT);
    } catch (err) {
      setError("An error occurred while generating the summary.");
      setState(AppState.INPUT); 
    }
  };

  // --- Render Helpers ---

  const renderLoading = (message: string) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <Loader2 className="w-12 h-12 text-yt-red animate-spin mb-4" />
      <p className="text-lg font-medium text-gray-600 animate-pulse">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f9f9f9] font-sans text-gray-900">
      {/* Header - Only show simplistic header if not in input state to avoid visual clutter */}
      {state !== AppState.INPUT && (
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-30 px-4 py-3 flex justify-center">
          <span className="font-bold tracking-tight flex items-center gap-2 text-gray-800">
             <div className="w-6 h-4 bg-yt-red rounded-lg flex items-center justify-center">
               <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[5px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
             </div>
             YouTube Summarizer
          </span>
        </header>
      )}

      <main className="w-full">
        {state === AppState.INPUT && (
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} error={error} />
        )}

        {state === AppState.CONFIRM && (
          <Confirmation 
            title={videoTitle} 
            videoId={videoId}
            onConfirm={handleConfirm} 
            onCancel={handleCancel} 
          />
        )}

        {state === AppState.OPTIONS && (
          <OptionSelector selectedIds={selectedOptions} onToggle={toggleOption} onNext={handleOptionsNext} />
        )}

        {state === AppState.TOPIC_INPUT && (
          <TopicInput videoTitle={videoTitle} onSubmit={handleTopicSubmit} />
        )}

        {state === AppState.GENERATING && renderLoading(`Summarizing "${videoTitle}"...`)}

        {state === AppState.RESULT && (
          <ResultDisplay 
            markdown={summaryResult} 
            onReset={handleCancel} 
            onResummarize={() => setState(AppState.OPTIONS)} 
          />
        )}
      </main>
    </div>
  );
}

export default App;