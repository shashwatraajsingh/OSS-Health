import React from 'react';
import { ExternalLink, Calendar, Code, Shield, GitBranch } from 'lucide-react';

const RepositoryInfo = ({ repository, metrics }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="metric-card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Repository Details</h3>
      
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              Created
            </div>
            <div className="font-medium">{formatDate(repository.created_at)}</div>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-2" />
              Last Updated
            </div>
            <div className="font-medium">{formatDate(repository.updated_at)}</div>
          </div>
        </div>

        {/* Language and Size */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Code className="w-4 h-4 mr-2" />
              Primary Language
            </div>
            <div className="font-medium">{repository.language || 'Not specified'}</div>
          </div>
          
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <GitBranch className="w-4 h-4 mr-2" />
              Default Branch
            </div>
            <div className="font-medium">{repository.default_branch}</div>
          </div>
        </div>

        {/* License and Topics */}
        {repository.license && (
          <div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Shield className="w-4 h-4 mr-2" />
              License
            </div>
            <div className="font-medium">{repository.license.name}</div>
          </div>
        )}

        {repository.topics && repository.topics.length > 0 && (
          <div>
            <div className="text-sm text-gray-600 mb-2">Topics</div>
            <div className="flex flex-wrap gap-2">
              {repository.topics.slice(0, 8).map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {topic}
                </span>
              ))}
              {repository.topics.length > 8 && (
                <span className="text-xs text-gray-500">
                  +{repository.topics.length - 8} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <a
              href={repository.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View on GitHub
            </a>
            
            {repository.homepage && (
              <a
                href={repository.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Project Homepage
              </a>
            )}
          </div>
        </div>

        {/* Repository Stats */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Open Issues</span>
              <span className="font-medium">{repository.open_issues_count}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Size</span>
              <span className="font-medium">{formatBytes(repository.size * 1024)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Has Wiki</span>
              <span className="font-medium">{repository.has_wiki ? 'Yes' : 'No'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Has Pages</span>
              <span className="font-medium">{repository.has_pages ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Security Features</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Security Policy</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metrics.security.metrics.hasSecurityPolicy 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {metrics.security.metrics.hasSecurityPolicy ? 'Enabled' : 'Not Set'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Dependabot</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metrics.security.metrics.hasDependabot 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {metrics.security.metrics.hasDependabot ? 'Enabled' : 'Not Set'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepositoryInfo;
