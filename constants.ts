import { SummaryOption } from './types';

export const SUMMARY_OPTIONS: SummaryOption[] = [
  { id: 1, label: "TL;DR", description: "1-2 sentence summary at the top.", category: "Core" },
  { id: 2, label: "Timestamps", description: "Approximate timestamps for key points.", category: "Core" },
  { id: 3, label: "Actionable Insights", description: "List of tips, tools, or advice.", category: "Content" },
  { id: 4, label: "Separate Speakers", description: "Organize summary by speaker.", category: "Content" },
  { id: 5, label: "Specific Topic", description: "Focus on one specific topic.", requiresInput: true, category: "Content" },
  { id: 6, label: "Tone Analysis", description: "Describe the speaker's tone/sentiment.", category: "Content" },
  { id: 7, label: "Step-by-Step Guide", description: "Format insights as a tutorial.", category: "Content" },
  { id: 8, label: "Comprehensive", description: "Detailed summary of all key points.", category: "Core" },
  { id: 9, label: "Key Quotes", description: "2-3 significant quotes with context.", category: "Content" },
  { id: 10, label: "Audience Takeaways", description: "Benefits for specific audience groups.", category: "Content" },
  { id: 11, label: "Related Content", description: "Compare to similar videos.", category: "Content" },
  { id: 12, label: "Visual Elements", description: "Summarize graphics & overlays.", category: "Visual" },
  { id: 13, label: "Visual Style", description: "Aesthetic, colors, editing style.", category: "Visual" },
  { id: 14, label: "Visual Data", description: "Extract data from charts/graphs.", category: "Visual" },
  { id: 15, label: "Audio Narration", description: "Analyze narration style.", category: "Audio" },
  { id: 16, label: "Background Audio", description: "Music and sound effects summary.", category: "Audio" },
  { id: 17, label: "Audio Cues", description: "Moments emphasized by sound.", category: "Audio" },
];

export const PLACEHOLDER_IMAGE = "https://picsum.photos/1200/600"; // Fallback if we needed one, but we use clean UI.
