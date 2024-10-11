import React from 'react';
import { Loader } from 'lucide-react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader className="animate-spin text-blue-500" size={24} />
      <span className="ml-2">処理中...</span>
    </div>
  );
};

export default LoadingIndicator;