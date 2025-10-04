import React, { useState } from 'react';
import { Search, Github } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const SearchForm = ({ onAnalyze }) => {
  const [repoUrl, setRepoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    setIsSubmitting(true);
    try {
      await onAnalyze(repoUrl.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const exampleRepos = [
    'facebook/react',
    'microsoft/vscode',
    'django/django',
    'nodejs/node',
    'vuejs/vue'
  ];

  const handleExampleClick = (repo) => {
    setRepoUrl(`https://github.com/${repo}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-5 w-5" />
          Analyze Repository
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="repo-url" className="text-sm font-medium">
              GitHub Repository URL
            </label>
            <div className="relative">
              <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="repo-url"
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="pl-10"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!repoUrl.trim() || isSubmitting}
            className="w-full"
            size="lg"
          >
            <Search className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Analyzing...' : 'Analyze Repository'}
          </Button>
        </form>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Try these popular repositories:</p>
          <div className="flex flex-wrap gap-2">
            {exampleRepos.map((repo) => (
              <Badge
                key={repo}
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80"
                onClick={() => handleExampleClick(repo)}
              >
                {repo}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchForm;
