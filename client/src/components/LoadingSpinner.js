import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-medium text-gray-900">Analyzing Repository</h3>
        <p className="text-gray-600 mt-1">
          Fetching comprehensive data from GitHub, npm, and PyPI...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          For large repositories, this may take a moment to fetch all contributors
        </p>
      </div>
      
      <div className="mt-6 w-full max-w-md">
        <div className="bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full animate-pulse-slow" style={{ width: '60%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Gathering metrics...</span>
          <span>This may take a moment</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
