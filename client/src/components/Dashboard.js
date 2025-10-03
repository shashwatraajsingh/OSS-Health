import React from 'react';
import { ArrowLeft, ExternalLink, Calendar, Users, GitFork, Star, Plus, Download } from 'lucide-react';
import ScoreCard from './ScoreCard';
import MetricsChart from './MetricsChart';
import RepositoryInfo from './RepositoryInfo';
import HealthInsights from './HealthInsights';
import { exportToJSON } from '../utils/exportUtils';

const Dashboard = ({ data, onReset, onAddToComparison }) => {
  const { repository, metrics, lastUpdated } = data;

  // Calculate overall score
  const overallScore = Math.round(
    (metrics.popularity.score * 0.2 +
     metrics.activity.score * 0.25 +
     metrics.maintenance.score * 0.25 +
     metrics.security.score * 0.15 +
     metrics.community.score * 0.15)
  );

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Analyze Another Repository</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => exportToJSON(data)}
            className="flex items-center space-x-2 btn-secondary"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          {onAddToComparison && (
            <button
              onClick={() => onAddToComparison(data)}
              className="flex items-center space-x-2 btn-secondary"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Comparison</span>
            </button>
          )}
          <div className="text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Repository Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {repository.full_name}
              </h1>
              <a
                href={repository.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            
            {repository.description && (
              <p className="text-gray-600 text-lg mb-4">{repository.description}</p>
            )}
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{repository.stargazers_count?.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork className="w-4 h-4" />
                <span>{repository.forks_count?.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{repository.watchers_count?.toLocaleString()} watchers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date(repository.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)} mb-2`}>
              {overallScore}
            </div>
            <div className={`score-badge ${getScoreBadge(overallScore)}`}>
              Overall Health
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <ScoreCard
          title="Popularity"
          score={metrics.popularity.score}
          icon="⭐"
          description="Stars, forks, downloads"
          metrics={metrics.popularity.metrics}
        />
        <ScoreCard
          title="Activity"
          score={metrics.activity.score}
          icon="📈"
          description="Commits, PRs, releases"
          metrics={metrics.activity.metrics}
        />
        <ScoreCard
          title="Maintenance"
          score={metrics.maintenance.score}
          icon="🛠️"
          description="Issue & PR management"
          metrics={metrics.maintenance.metrics}
        />
        <ScoreCard
          title="Security"
          score={metrics.security.score}
          icon="🔒"
          description="Security policies & alerts"
          metrics={metrics.security.metrics}
        />
        <ScoreCard
          title="Community"
          score={metrics.community.score}
          icon="👥"
          description="Contributors & engagement"
          metrics={metrics.community.metrics}
        />
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <MetricsChart
          title="Health Metrics Breakdown"
          data={[
            { name: 'Popularity', score: metrics.popularity.score, color: '#3b82f6' },
            { name: 'Activity', score: metrics.activity.score, color: '#10b981' },
            { name: 'Maintenance', score: metrics.maintenance.score, color: '#f59e0b' },
            { name: 'Security', score: metrics.security.score, color: '#ef4444' },
            { name: 'Community', score: metrics.community.score, color: '#8b5cf6' }
          ]}
        />
        
        <RepositoryInfo repository={repository} metrics={metrics} />
      </div>

      {/* Health Insights */}
      <div className="mb-8">
        <HealthInsights metrics={metrics} repository={repository} />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popularity Details */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">⭐</span>
            Popularity Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">GitHub Stars</span>
              <span className="font-medium">{metrics.popularity.metrics.stars.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Forks</span>
              <span className="font-medium">{metrics.popularity.metrics.forks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Watchers</span>
              <span className="font-medium">{metrics.popularity.metrics.watchers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Package Downloads</span>
              <span className="font-medium">{metrics.popularity.metrics.downloads.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">📈</span>
            Activity Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Recent Issues (30d)</span>
              <span className="font-medium">{metrics.activity.metrics.recentIssues}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recent PRs (30d)</span>
              <span className="font-medium">{metrics.activity.metrics.recentPRs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Recent Releases (90d)</span>
              <span className="font-medium">{metrics.activity.metrics.recentReleases}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days Since Last Push</span>
              <span className="font-medium">{metrics.activity.metrics.daysSinceLastPush}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Details */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">🛠️</span>
            Maintenance Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Open Issues</span>
              <span className="font-medium">{metrics.maintenance.metrics.openIssues}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Issue Close Ratio</span>
              <span className="font-medium">{(metrics.maintenance.metrics.issueCloseRatio * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Open PRs</span>
              <span className="font-medium">{metrics.maintenance.metrics.openPRs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Stale Issues</span>
              <span className="font-medium">{metrics.maintenance.metrics.staleIssues}</span>
            </div>
          </div>
        </div>

        {/* Community Details */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">👥</span>
            Community Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Contributors</span>
              <span className="font-medium">{metrics.community.metrics.totalContributors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Core Contributors</span>
              <span className="font-medium">{metrics.community.metrics.coreContributors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">External Contributors</span>
              <span className="font-medium">{metrics.community.metrics.externalContributors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Comments</span>
              <span className="font-medium">{metrics.community.metrics.totalComments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
