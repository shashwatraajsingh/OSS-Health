import React, { useState } from 'react';
import { Plus, X, BarChart3, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { exportToCSV } from '../utils/exportUtils';

const ComparisonView = ({ repositories, onRemove, onAddNew }) => {
  const [showChart, setShowChart] = useState(true);

  if (repositories.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Compare Repositories</h3>
        <p className="text-gray-600 mb-4">
          Analyze multiple repositories side by side to compare their health metrics.
        </p>
        <button
          onClick={onAddNew}
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Repository
        </button>
      </div>
    );
  }

  // Prepare data for comparison chart
  const chartData = repositories.map(repo => ({
    name: repo.repository.name,
    popularity: repo.metrics.popularity.score,
    activity: repo.metrics.activity.score,
    maintenance: repo.metrics.maintenance.score,
    security: repo.metrics.security.score,
    community: repo.metrics.community.score,
    overall: repo.metrics.overall
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Repository Comparison</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => exportToCSV(repositories)}
            className="btn-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            onClick={() => setShowChart(!showChart)}
            className="btn-secondary"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showChart ? 'Hide Chart' : 'Show Chart'}
          </button>
          <button
            onClick={onAddNew}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Repository
          </button>
        </div>
      </div>

      {/* Comparison Chart */}
      {showChart && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="popularity" fill="#3b82f6" name="Popularity" />
              <Bar dataKey="activity" fill="#10b981" name="Activity" />
              <Bar dataKey="maintenance" fill="#f59e0b" name="Maintenance" />
              <Bar dataKey="security" fill="#ef4444" name="Security" />
              <Bar dataKey="community" fill="#8b5cf6" name="Community" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Repository Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {repositories.map((repo, index) => (
          <div key={repo.repository.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{repo.repository.full_name}</h3>
                <p className="text-sm text-gray-600 mt-1">{repo.repository.description}</p>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Overall Score */}
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold ${
                repo.metrics.overall >= 80 ? 'text-green-600' :
                repo.metrics.overall >= 60 ? 'text-blue-600' :
                repo.metrics.overall >= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {repo.metrics.overall}
              </div>
              <div className="text-sm text-gray-600">Overall Health</div>
            </div>

            {/* Metric Scores */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">⭐ Popularity</span>
                <span className="font-medium">{repo.metrics.popularity.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">📈 Activity</span>
                <span className="font-medium">{repo.metrics.activity.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🛠️ Maintenance</span>
                <span className="font-medium">{repo.metrics.maintenance.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">🔒 Security</span>
                <span className="font-medium">{repo.metrics.security.score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">👥 Community</span>
                <span className="font-medium">{repo.metrics.community.score}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {repo.repository.stargazers_count?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Stars</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {repo.repository.forks_count?.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Forks</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {repo.metrics.community.metrics.totalContributors}
                </div>
                <div className="text-xs text-gray-600">Contributors</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonView;
