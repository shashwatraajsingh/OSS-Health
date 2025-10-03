import React from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';

const HealthInsights = ({ metrics, repository }) => {
  const generateInsights = () => {
    const insights = [];

    // Popularity insights
    if (metrics.popularity.score >= 80) {
      insights.push({
        type: 'success',
        category: 'Popularity',
        message: 'Excellent popularity with strong community adoption',
        icon: CheckCircle
      });
    } else if (metrics.popularity.score < 40) {
      insights.push({
        type: 'warning',
        category: 'Popularity',
        message: 'Low popularity - consider improving documentation and marketing',
        icon: TrendingUp
      });
    }

    // Activity insights
    if (metrics.activity.metrics.daysSinceLastPush > 90) {
      insights.push({
        type: 'warning',
        category: 'Activity',
        message: `No recent activity (${metrics.activity.metrics.daysSinceLastPush} days since last push)`,
        icon: AlertTriangle
      });
    } else if (metrics.activity.score >= 70) {
      insights.push({
        type: 'success',
        category: 'Activity',
        message: 'Active development with regular updates',
        icon: CheckCircle
      });
    }

    // Maintenance insights
    if (metrics.maintenance.metrics.staleIssues > 20) {
      insights.push({
        type: 'warning',
        category: 'Maintenance',
        message: `High number of stale issues (${metrics.maintenance.metrics.staleIssues}) - needs attention`,
        icon: AlertTriangle
      });
    }

    if (metrics.maintenance.metrics.issueCloseRatio < 0.5) {
      insights.push({
        type: 'info',
        category: 'Maintenance',
        message: 'Low issue close ratio - consider improving issue triage',
        icon: Info
      });
    }

    // Security insights
    if (metrics.security.metrics.hasSecurityPolicy && metrics.security.metrics.hasDependabot) {
      insights.push({
        type: 'success',
        category: 'Security',
        message: 'Good security practices with policies and automated updates',
        icon: CheckCircle
      });
    } else {
      insights.push({
        type: 'info',
        category: 'Security',
        message: 'Consider enabling security policies and Dependabot',
        icon: Info
      });
    }

    // Community insights
    if (metrics.community.metrics.totalContributors === 1) {
      insights.push({
        type: 'warning',
        category: 'Community',
        message: 'Single contributor - project may be at risk if maintainer becomes unavailable',
        icon: AlertTriangle
      });
    } else if (metrics.community.metrics.externalContributors > 10) {
      insights.push({
        type: 'success',
        category: 'Community',
        message: 'Strong external contributor base indicates healthy community',
        icon: CheckCircle
      });
    }

    // License insights
    if (!repository.license) {
      insights.push({
        type: 'warning',
        category: 'Legal',
        message: 'No license specified - may limit adoption and contributions',
        icon: AlertTriangle
      });
    }

    // Documentation insights
    if (!repository.has_wiki && !repository.description) {
      insights.push({
        type: 'info',
        category: 'Documentation',
        message: 'Consider adding documentation and project description',
        icon: Info
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h3>
        <p className="text-gray-600">No specific insights available for this repository.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getInsightStyle(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(insight.type)}`} />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{insight.category}</span>
                  </div>
                  <p className="text-sm">{insight.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Health Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Overall Health Status</span>
          <div className="flex items-center space-x-2">
            {metrics.overall >= 80 ? (
              <>
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Excellent</span>
              </>
            ) : metrics.overall >= 60 ? (
              <>
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Good</span>
              </>
            ) : metrics.overall >= 40 ? (
              <>
                <Info className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">Fair</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Needs Attention</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsights;
