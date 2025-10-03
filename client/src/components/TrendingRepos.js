import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, GitFork, ExternalLink } from 'lucide-react';
import { getTrendingRepositories } from '../services/api';

const TrendingRepos = ({ onSelectRepo }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const repos = await getTrendingRepositories();
        setTrending(repos.slice(0, 6)); // Show top 6
      } catch (err) {
        setError('Failed to fetch trending repositories');
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Repositories</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Trending Repositories</h3>
        </div>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">Trending Repositories</h3>
      </div>
      
      <div className="space-y-4">
        {trending.map((repo) => (
          <div
            key={repo.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors cursor-pointer"
            onClick={() => onSelectRepo(repo.html_url)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                    {repo.full_name}
                  </h4>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                {repo.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{repo.stargazers_count?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{repo.forks_count?.toLocaleString()}</span>
                  </div>
                  {repo.language && (
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                      <span>{repo.language}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <button className="text-sm text-primary-600 hover:text-primary-700 transition-colors">
          View More Trending →
        </button>
      </div>
    </div>
  );
};

export default TrendingRepos;
