import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const LoadingSpinner = () => {
  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
        <div className="mt-4 text-center space-y-2">
          <h3 className="text-lg font-medium">Analyzing Repository</h3>
          <p className="text-muted-foreground">
            Fetching comprehensive data from GitHub, npm, and PyPI...
          </p>
          <p className="text-sm text-muted-foreground">
            For large repositories, this may take a moment to fetch all contributors
          </p>
        </div>
        
        <div className="mt-6 w-full">
          <div className="bg-secondary rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Gathering metrics...</span>
            <span>This may take a moment</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingSpinner;
