import React from 'react';

const ScoreCard = ({ title, score, icon, description, metrics }) => {
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

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="metric-card text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <div className={`text-3xl font-bold mb-2 ${getScoreColor(score)}`}>
        {score}
      </div>
      <div className={`score-badge ${getScoreBadge(score)} mb-3`}>
        {getScoreLabel(score)}
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      
      {/* Progress bar */}
      <div className="mt-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              score >= 80 ? 'bg-green-500' :
              score >= 60 ? 'bg-blue-500' :
              score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
