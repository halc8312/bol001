import React, { useRef, useState, useEffect } from 'react';
import { Mic, StopCircle, Upload } from 'lucide-react';

interface RecordingComponentProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: (file: File) => void;
  onFileUpload: (file: File) => void;
}

const RecordingComponent: React.FC<RecordingComponentProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleStartRecording = async () => {
    try {
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        throw new Error('このブラウザは録音機能をサポートしていません。最新のブラウザを使用してください。');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(newStream);
      const recorder = new MediaRecorder(newStream, { mimeType: 'audio/webm' });
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recorded_audio.webm', { type: 'audio/webm' });
        onStopRecording(audioFile);
        setAudioChunks([]);
      };

      recorder.start();
      onStartRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('録音の開始中にエラーが発生しました。マイクへのアクセスが許可されているか確認してください。');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validFormats = [
        'audio/flac',
        'audio/x-m4a',
        'audio/mp3',
        'audio/mp4',
        'audio/mpeg',
        'audio/mpga',
        'audio/oga',
        'audio/ogg',
        'audio/wav',
        'audio/webm'
      ];
      if (validFormats.includes(file.type)) {
        onFileUpload(file);
      } else {
        alert('サポートされていないファイル形式です。サポートされている形式: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm');
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {isRecording ? (
        <button
          onClick={handleStopRecording}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          <StopCircle className="mr-2" size={18} />
          録音停止
        </button>
      ) : (
        <button
          onClick={handleStartRecording}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Mic className="mr-2" size={18} />
          録音開始
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="audio/flac,audio/x-m4a,audio/mp3,audio/mp4,audio/mpeg,audio/mpga,audio/oga,audio/ogg,audio/wav,audio/webm"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <Upload className="mr-2" size={18} />
        ファイルをアップロード
      </button>
    </div>
  );
};

export default RecordingComponent;