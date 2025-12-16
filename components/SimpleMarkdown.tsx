import React from 'react';

interface SimpleMarkdownProps {
  content: string;
}

/**
 * A specific markdown renderer tailored for the prompt's requirements.
 * Handles: Headers (##), Bold (**), Lists (-), Links ([]()), and Tables.
 */
export const SimpleMarkdown: React.FC<SimpleMarkdownProps> = ({ content }) => {
  // Pre-process to handle tables first since they are multi-line structures
  // Improved regex to catch tables even if they are at the end of the string
  const parts = content.split(/(\n\|.*\|\n[\s\S]*?(?:\n\n|$))/g);

  return (
    <div className="prose prose-red max-w-none text-gray-800 leading-relaxed space-y-4">
      {parts.map((part, index) => {
        if (part.trim().startsWith('|')) {
          return <MarkdownTable key={index} tableString={part} />;
        }
        return <MarkdownText key={index} text={part} />;
      })}
    </div>
  );
};

const MarkdownTable: React.FC<{ tableString: string }> = ({ tableString }) => {
  const rows = tableString.trim().split('\n').map(row => 
    row.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim())
  ).filter(row => row.length > 0);

  if (rows.length < 2) return null;

  const headers = rows[0];
  const dataRows = rows.slice(2); // Skip header and separator row (---)

  return (
    <div className="overflow-x-auto my-6 border rounded-lg shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <MarkdownText text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dataRows.map((row, rIndex) => (
            <tr key={rIndex}>
              {row.map((cell, cIndex) => (
                <td key={cIndex} className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700">
                  <MarkdownText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  // Split by newlines for paragraphs/lists
  const lines = text.split('\n');

  return (
    <>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;

        // Headers
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3">{parseInline(line.substring(3))}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-semibold text-gray-800 mt-5 mb-2">{parseInline(line.substring(4))}</h3>;
        }

        // List items
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <div key={i} className="flex items-start ml-4 mb-2">
              <span className="mr-2 text-yt-red">•</span>
              <span>{parseInline(line.trim().substring(2))}</span>
            </div>
          );
        }
        // Numbered Lists (rough approximation)
        if (/^\d+\.\s/.test(line.trim())) {
           const match = line.trim().match(/^(\d+)\.\s(.*)/);
           if (match) {
             return (
               <div key={i} className="flex items-start ml-4 mb-2">
                 <span className="mr-2 font-semibold text-gray-600">{match[1]}.</span>
                 <span>{parseInline(match[2])}</span>
               </div>
             );
           }
        }

        // Regular Paragraph
        return <p key={i} className="mb-2">{parseInline(line)}</p>;
      })}
    </>
  );
};

// Helper to parse bold and links within a line
const parseInline = (text: string): React.ReactNode[] => {
  const regex = /(\*\*.*?\*\*)|(\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
    }

    // Link
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const [label, url] = part.slice(1, -1).split('](');
      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-yt-red hover:underline font-medium"
        >
          {label}
        </a>
      );
    }

    return part;
  });
};