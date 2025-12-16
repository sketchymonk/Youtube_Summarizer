import React, { useState } from 'react';
import { SUMMARY_OPTIONS } from '../constants';
import { SummaryOption } from '../types';
import { CheckCircle2, Circle, ChevronRight, MessageSquare } from 'lucide-react';

interface OptionSelectorProps {
  selectedIds: number[];
  onToggle: (id: number) => void;
  onNext: () => void;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({ selectedIds, onToggle, onNext }) => {
  const categories = Array.from(new Set(SUMMARY_OPTIONS.map(o => o.category)));

  return (
    <div className="pb-24 px-4 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6 pt-4">
        <h2 className="text-2xl font-bold text-gray-900">Format Options</h2>
        <p className="text-gray-500">Select the elements you want in your summary.</p>
      </div>

      <div className="space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUMMARY_OPTIONS.filter(opt => opt.category === category).map(option => (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSelected={selectedIds.includes(option.id)}
                  onToggle={() => onToggle(option.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 flex justify-center z-20">
        <button
          onClick={onNext}
          disabled={selectedIds.length === 0}
          className={`max-w-md w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all
            ${selectedIds.length === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-yt-black text-white hover:bg-gray-900 active:scale-[0.98]'}`}
        >
          Next Step
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const OptionCard: React.FC<{ option: SummaryOption; isSelected: boolean; onToggle: () => void }> = ({ option, isSelected, onToggle }) => (
  <div
    onClick={onToggle}
    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
      ${isSelected 
        ? 'border-yt-red bg-red-50/50 shadow-sm' 
        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'}`}
  >
    <div className="flex justify-between items-start">
      <div className="flex-1 pr-8">
        <h4 className={`font-semibold text-sm mb-1 ${isSelected ? 'text-yt-red' : 'text-gray-900'}`}>
          {option.label}
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          {option.description}
        </p>
        {option.requiresInput && isSelected && (
           <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              <MessageSquare size={10} /> INPUT REQUIRED
           </span>
        )}
      </div>
      <div className={`absolute top-4 right-4 transition-colors ${isSelected ? 'text-yt-red' : 'text-gray-200'}`}>
        {isSelected ? <CheckCircle2 className="w-6 h-6 fill-red-100" /> : <Circle className="w-6 h-6" />}
      </div>
    </div>
  </div>
);
