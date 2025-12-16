import { GoogleGenAI } from "@google/genai";
import { SUMMARY_OPTIONS } from "../constants";

/**
 * Extracts the YouTube Video ID from various URL formats.
 * Supports: standard watch, short URLs, embeds, shorts, etc.
 */
export const extractVideoId = (url: string): string | null => {
  // Robust regex covering most YouTube URL variations
  // Handles: https://youtu.be/ID, https://youtube.com/watch?v=ID, https://youtube.com/shorts/ID
  const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(regExp);
  // Standard YouTube IDs are 11 characters
  return (match && match[1].length === 11) ? match[1] : null;
};

/**
 * Fetches the video title.
 * Priority 1: oEmbed (via noembed.com) - Fast, accurate, no hallucinations.
 * Priority 2: Gemini - Fallback if oEmbed fails.
 */
export const fetchVideoTitle = async (url: string): Promise<string> => {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL format");

  // 1. Try deterministic oEmbed lookup
  try {
    // Construct a clean watch URL for the lookup to ensure highest compatibility
    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(`https://noembed.com/embed?url=${cleanUrl}`);
    const data = await response.json();
    
    if (data.title && !data.error) {
      return data.title;
    }
  } catch (e) {
    console.warn("oEmbed lookup failed, falling back to AI.", e);
  }

  // 2. Fallback to Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const model = 'gemini-2.5-flash';
    // We specifically ask the model to look up the ID, which is less prone to error than just a generic search
    const prompt = `Search for the YouTube video with ID "${videoId}". What is its exact title? Return ONLY the title as a plain string. Do not add quotes or any other text.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text?.trim();
    if (!text || text.includes("INVALID_VIDEO")) {
      throw new Error("Video not found");
    }
    return text.replace(/^"|"$/g, ''); // Remove accidental quotes
  } catch (error) {
    console.error("Error fetching title via AI:", error);
    throw error;
  }
};

/**
 * Generates the summary based on the prompt's complex rules.
 */
export const generateVideoSummary = async (
  url: string,
  title: string,
  selectedOptionIds: number[],
  specificTopic?: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const videoId = extractVideoId(url); // Extract again to ensure it is in the prompt context

  try {
    const selectedOptions = SUMMARY_OPTIONS.filter((opt) => selectedOptionIds.includes(opt.id));
    
    // Constructing the specific instructions based on selected options
    const optionInstructions = selectedOptions.map(opt => {
      let instruction = `${opt.id}. ${opt.label}: ${opt.description}`;
      
      // Specific Prompt Rules injected here
      if (opt.id === 2) {
        instruction += ` CRITICAL: This MUST be formatted as a Markdown Table with two columns: 'Time' and 'Topic'. For hyperlinks in the Time column, use the format \`[MM:SS](https://www.youtube.com/watch?v=${videoId}&t=MMmSSs)\`.`;
      }
      if (opt.id === 5 && specificTopic) {
        instruction += ` FOCUS TOPIC: "${specificTopic}". The entire summary should revolve around this.`;
      }
      if (opt.id === 9) {
        instruction += " CRITICAL: This MUST be formatted as a Markdown Table with two columns: 'Time' and 'Quote'.";
      }
      if (opt.id === 11) {
        instruction += " Use Google Search to find comparison videos.";
      }
      return instruction;
    }).join("\n");

    const fullPrompt = `
      You are "YouTube Summarizer".
      
      TARGET VIDEO INFORMATION:
      - ID: "${videoId}"
      - Title: "${title}"
      - URL: "${url}"
      
      YOUR GOAL:
      Generate a precise and useful summary for this video.

      DATA GATHERING STRATEGY (STRICT):
      1. **SEARCH**: Use the 'googleSearch' tool to search for the EXACT VIDEO TITLE: "${title}".
      2. **CONTEXT**: Search for the specific VIDEO ID "${videoId}" to find metadata.
      3. **SYNTHESIS**: You must assume the role of a researcher. If you cannot access the video transcript directly via tools, you MUST find summaries, news articles, or transcripts of this event/video on the web and use that information to construct the response.
      4. **NO REFUSALS**: Do not answer that you "cannot access the content". Instead, provide the best possible summary based on the search results for the video's title and topic.

      SELECTED OPTIONS (Output strictly based on these):
      ${optionInstructions}
      
      FORMATTING RULES:
      - Start directly with "## Summary of ${selectedOptionIds.includes(5) && specificTopic ? specificTopic + " from " : ""}${title}"
      - Use standard Markdown.
      - For Option 2 and Option 9, YOU MUST USE MARKDOWN TABLES.
      - If Option 12-17 (Visual/Audio) are selected but you cannot see the video, try to infer from reviews/articles or state "Information not available in search results".
      - Be professional, concise, and helpful.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Removed fixed thinkingBudget to let the model optimize its own reasoning path
      }
    });

    return response.text || "Failed to generate summary. Please try again.";
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
};
