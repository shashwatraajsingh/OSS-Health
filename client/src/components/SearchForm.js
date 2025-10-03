import React, { useState } from 'react';
import { Search, Github } from 'lucide-react';

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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="repo-url"
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!repoUrl.trim() || isSubmitting}
          className="w-full flex items-center justify-center space-x-2 btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3"
        >
          <Search className="w-5 h-5" />
          <span>{isSubmitting ? 'Analyzing...' : 'Analyze Repository'}</span>
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">Try these popular repositories:</p>
        <div className="flex flex-wrap gap-2">
          {exampleRepos.map((repo) => (
            <button
              key={repo}
              onClick={() => handleExampleClick(repo)}
              className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
              disabled={isSubmitting}
            >
              {repo}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
