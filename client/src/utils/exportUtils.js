export const exportToJSON = (data) => {
  const exportData = {
    repository: {
      name: data.repository.full_name,
      description: data.repository.description,
      url: data.repository.html_url,
      stars: data.repository.stargazers_count,
      forks: data.repository.forks_count,
      language: data.repository.language,
      license: data.repository.license?.name,
      created_at: data.repository.created_at,
      updated_at: data.repository.updated_at
    },
    health_metrics: {
      overall_score: data.metrics.overall,
      popularity: {
        score: data.metrics.popularity.score,
        stars: data.metrics.popularity.metrics.stars,
        forks: data.metrics.popularity.metrics.forks,
        downloads: data.metrics.popularity.metrics.downloads
      },
      activity: {
        score: data.metrics.activity.score,
        recent_issues: data.metrics.activity.metrics.recentIssues,
        recent_prs: data.metrics.activity.metrics.recentPRs,
        recent_releases: data.metrics.activity.metrics.recentReleases,
        days_since_last_push: data.metrics.activity.metrics.daysSinceLastPush
      },
      maintenance: {
        score: data.metrics.maintenance.score,
        open_issues: data.metrics.maintenance.metrics.openIssues,
        issue_close_ratio: data.metrics.maintenance.metrics.issueCloseRatio,
        stale_issues: data.metrics.maintenance.metrics.staleIssues
      },
      security: {
        score: data.metrics.security.score,
        has_security_policy: data.metrics.security.metrics.hasSecurityPolicy,
        has_dependabot: data.metrics.security.metrics.hasDependabot,
        security_advisories: data.metrics.security.metrics.securityAdvisories
      },
      community: {
        score: data.metrics.community.score,
        total_contributors: data.metrics.community.metrics.totalContributors,
        external_contributors: data.metrics.community.metrics.externalContributors,
        total_comments: data.metrics.community.metrics.totalComments
      }
    },
    analysis_date: data.lastUpdated,
    generated_by: 'OSS Health Dashboard'
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${data.repository.name.replace('/', '_')}_health_report.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (repositories) => {
  const headers = [
    'Repository',
    'Overall Score',
    'Popularity',
    'Activity', 
    'Maintenance',
    'Security',
    'Community',
    'Stars',
    'Forks',
    'Contributors',
    'Language',
    'License'
  ];

  const rows = repositories.map(data => [
    data.repository.full_name,
    data.metrics.overall,
    data.metrics.popularity.score,
    data.metrics.activity.score,
    data.metrics.maintenance.score,
    data.metrics.security.score,
    data.metrics.community.score,
    data.repository.stargazers_count,
    data.repository.forks_count,
    data.metrics.community.metrics.totalContributors,
    data.repository.language || 'N/A',
    data.repository.license?.name || 'N/A'
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'oss_health_comparison.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
