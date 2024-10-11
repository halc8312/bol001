import React, { useState, useEffect } from 'react';
import RecordingComponent from './components/RecordingComponent';
import TranscriptComponent from './components/TranscriptComponent';
import SearchComponent from './components/SearchComponent';
import ApiKeyInput from './components/ApiKeyInput';
import LoadingIndicator from './components/LoadingIndicator';
import { transcribeAudio, generateSummary } from './utils/openai';
import { saveMinutes, loadMinutes } from './utils/storage';
import { Minute } from './types';

const App: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [summaryLevel, setSummaryLevel] = useState('standard');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setMinutes(loadMinutes());
  }, []);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = async (file: File) => {
    setIsRecording(false);
    setAudioFile(file);
    await processAudio(file);
  };

  const handleFileUpload = async (file: File) => {
    setAudioFile(file);
    await processAudio(file);
  };

  const processAudio = async (audioData: File) => {
    if (!apiKey) {
      setErrorMessage('APIキーを設定してください。');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const transcriptText = await transcribeAudio(apiKey, audioData);
      setTranscript(transcriptText);
      const summaryText = await generateSummary(apiKey, transcriptText, summaryLevel);
      setSummary(summaryText);

      const newMinute: Minute = {
        id: Date.now().toString(),
        transcript: transcriptText,
        summary: summaryText,
        date: new Date().toISOString(),
      };

      const updatedMinutes = [...minutes, newMinute];
      setMinutes(updatedMinutes);
      saveMinutes(updatedMinutes);
    } catch (error: any) {
      console.error('Error processing audio:', error);
      setErrorMessage(error.message || '音声の処理中にエラーが発生しました。APIキーが正しいことを確認してください。');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeySubmit = (key: string) => {
    setApiKey(key);
  };

  const handleSearch = (term: string) => {
    console.log('Searching for:', term);
  };

  const handleSummaryLevelChange = async (level: string) => {
    setSummaryLevel(level);
    if (transcript) {
      setIsLoading(true);
      try {
        const newSummary = await generateSummary(apiKey, transcript, level);
        setSummary(newSummary);
      } catch (error: any) {
        console.error('Error generating summary:', error);
        setErrorMessage('要約の生成中にエラーが発生しました。');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">AI議事録</h1>
      <ApiKeyInput onApiKeySubmit={handleApiKeySubmit} />
      <RecordingComponent
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
        onFileUpload={handleFileUpload}
      />
      <SearchComponent onSearch={handleSearch} />
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <TranscriptComponent
          transcript={transcript}
          summary={summary}
          onSummaryLevelChange={handleSummaryLevelChange}
        />
      )}
      {errorMessage && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default App;