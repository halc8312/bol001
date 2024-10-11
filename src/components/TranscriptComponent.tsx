import React from 'react';
import { FileText } from 'lucide-react';

interface TranscriptComponentProps {
  transcript: string;
  summary: string;
  onSummaryLevelChange: (level: string) => void;
}

const TranscriptComponent: React.FC<TranscriptComponentProps> = ({
  transcript,
  summary,
  onSummaryLevelChange,
}) => {
  const handleSummaryLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSummaryLevelChange(event.target.value);
  };

  return (
    <div className="border rounded p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="mr-2" size={24} />
          文字起こしと要約
        </h2>
        <select
          onChange={handleSummaryLevelChange}
          className="border rounded px-2 py-1"
        >
          <option value="brief">簡潔な要約</option>
          <option value="standard">標準的な要約</option>
          <option value="detailed">詳細な要約</option>
        </select>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="font-semibold mb-2">文字起こし:</h3>
        <p>{transcript}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">要約:</h3>
        <p>{summary}</p>
      </div>
    </div>
  );
};

export default TranscriptComponent;