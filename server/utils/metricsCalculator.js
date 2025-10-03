class MetricsCalculator {
  calculateAllMetrics(data) {
    const { repository, contributors, issues, pullRequests, releases, security, packageInfo } = data;
    
    const metrics = {
      popularity: this.calculatePopularityScore(repository, packageInfo),
      activity: this.calculateActivityScore(repository, issues, pullRequests, releases),
      maintenance: this.calculateMaintenanceScore(issues, pullRequests, repository),
      security: this.calculateSecurityScore(security, repository),
      community: this.calculateCommunityScore(contributors, issues, pullRequests, repository)
    };

    // Calculate overall score
    metrics.overall = this.calculateOverallScore(metrics);
    
    return metrics;
  }

  calculatePopularityScore(repo, packageInfo) {
    const metrics = {
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      watchers: repo.watchers_count || 0,
      downloads: packageInfo?.downloads?.total || 0
    };

    // Scoring weights
    const starScore = Math.min(metrics.stars / 1000, 10) * 2; // Max 20 points
    const forkScore = Math.min(metrics.forks / 200, 10) * 1.5; // Max 15 points
    const watcherScore = Math.min(metrics.watchers / 100, 10) * 1; // Max 10 points
    const downloadScore = Math.min(metrics.downloads / 10000, 10) * 1.5; // Max 15 points

    const score = Math.min(starScore + forkScore + watcherScore + downloadScore, 100);

    return {
      score: Math.round(score),
      metrics,
      breakdown: {
        stars: Math.round(starScore),
        forks: Math.round(forkScore),
        watchers: Math.round(watcherScore),
        downloads: Math.round(downloadScore)
      }
    };
  }

  calculateActivityScore(repo, issues, pullRequests, releases) {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const lastPush = new Date(repo.pushed_at);

    // Recent activity metrics
    const recentIssues = issues.filter(issue => 
      new Date(issue.created_at) > oneMonthAgo
    ).length;
    
    const recentPRs = pullRequests.filter(pr => 
      new Date(pr.created_at) > oneMonthAgo
    ).length;

    const recentReleases = releases.filter(release => 
      new Date(release.created_at) > threeMonthsAgo
    ).length;

    const daysSinceLastPush = Math.floor((now - lastPush) / (1000 * 60 * 60 * 24));

    const metrics = {
      recentIssues,
      recentPRs,
      recentReleases,
      daysSinceLastPush,
      lastPush: repo.pushed_at
    };

    // Scoring
    const issueScore = Math.min(recentIssues * 2, 25); // Max 25 points
    const prScore = Math.min(recentPRs * 3, 30); // Max 30 points
    const releaseScore = Math.min(recentReleases * 10, 25); // Max 25 points
    
    // Penalty for inactivity
    let pushScore = 20;
    if (daysSinceLastPush > 30) pushScore = 10;
    if (daysSinceLastPush > 90) pushScore = 5;
    if (daysSinceLastPush > 180) pushScore = 0;

    const score = Math.min(issueScore + prScore + releaseScore + pushScore, 100);

    return {
      score: Math.round(score),
      metrics,
      breakdown: {
        issues: Math.round(issueScore),
        pullRequests: Math.round(prScore),
        releases: Math.round(releaseScore),
        recency: Math.round(pushScore)
      }
    };
  }

  calculateMaintenanceScore(issues, pullRequests, repo) {
    const openIssues = issues.filter(issue => issue.state === 'open');
    const closedIssues = issues.filter(issue => issue.state === 'closed');
    const openPRs = pullRequests.filter(pr => pr.state === 'open');
    const closedPRs = pullRequests.filter(pr => pr.state === 'closed');

    // Calculate stale issues/PRs (older than 30 days with no activity)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const staleIssues = openIssues.filter(issue => 
      new Date(issue.updated_at) < thirtyDaysAgo
    ).length;
    
    const stalePRs = openPRs.filter(pr => 
      new Date(pr.updated_at) < thirtyDaysAgo
    ).length;

    const metrics = {
      openIssues: openIssues.length,
      closedIssues: closedIssues.length,
      openPRs: openPRs.length,
      closedPRs: closedPRs.length,
      staleIssues,
      stalePRs,
      issueCloseRatio: closedIssues.length / (closedIssues.length + openIssues.length) || 0,
      prCloseRatio: closedPRs.length / (closedPRs.length + openPRs.length) || 0
    };

    // Scoring
    const issueRatioScore = metrics.issueCloseRatio * 30; // Max 30 points
    const prRatioScore = metrics.prCloseRatio * 30; // Max 30 points
    
    // Penalty for too many stale items
    const staleIssuesPenalty = Math.min(staleIssues * 2, 20);
    const stalePRsPenalty = Math.min(stalePRs * 3, 20);
    
    const score = Math.max(
      issueRatioScore + prRatioScore - staleIssuesPenalty - stalePRsPenalty + 40,
      0
    );

    return {
      score: Math.round(Math.min(score, 100)),
      metrics,
      breakdown: {
        issueManagement: Math.round(issueRatioScore),
        prManagement: Math.round(prRatioScore),
        stalePenalty: Math.round(staleIssuesPenalty + stalePRsPenalty)
      }
    };
  }

  calculateSecurityScore(securityAdvisories, repo) {
    const hasSecurityPolicy = repo.security_and_analysis?.secret_scanning?.status === 'enabled';
    const hasDependabot = repo.security_and_analysis?.dependabot_security_updates?.status === 'enabled';
    
    const metrics = {
      securityAdvisories: securityAdvisories.length,
      hasSecurityPolicy,
      hasDependabot,
      vulnerabilityAlerts: 0 // Would need special permissions to access
    };

    // Base score
    let score = 60; // Start with reasonable baseline
    
    // Bonus for security features
    if (hasSecurityPolicy) score += 15;
    if (hasDependabot) score += 15;
    
    // Penalty for security advisories (indicates past vulnerabilities)
    const advisoryPenalty = Math.min(securityAdvisories.length * 5, 30);
    score -= advisoryPenalty;
    
    // Bonus for recent security updates in advisories (shows responsiveness)
    const recentAdvisories = securityAdvisories.filter(advisory => {
      const publishedDate = new Date(advisory.published_at);
      const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
      return publishedDate > sixMonthsAgo;
    });
    
    if (recentAdvisories.length > 0 && securityAdvisories.length > 0) {
      score += 10; // Bonus for addressing recent security issues
    }

    return {
      score: Math.round(Math.max(Math.min(score, 100), 0)),
      metrics,
      breakdown: {
        securityFeatures: (hasSecurityPolicy ? 15 : 0) + (hasDependabot ? 15 : 0),
        advisoryPenalty: Math.round(advisoryPenalty),
        responsivenessBonus: recentAdvisories.length > 0 ? 10 : 0
      }
    };
  }

  calculateCommunityScore(contributors, issues, pullRequests, repo) {
    const uniqueContributors = contributors.length;
    const coreContributors = contributors.filter(c => c.contributions >= 10).length;
    
    // Calculate community engagement
    const issueComments = issues.reduce((sum, issue) => sum + (issue.comments || 0), 0);
    const prComments = pullRequests.reduce((sum, pr) => sum + (pr.comments || 0), 0);
    const totalComments = issueComments + prComments;
    
    // External contributors (not the owner)
    const externalContributors = contributors.filter(c => 
      c.login.toLowerCase() !== repo.owner.login.toLowerCase()
    ).length;

    const metrics = {
      totalContributors: uniqueContributors,
      coreContributors,
      externalContributors,
      totalComments,
      avgCommentsPerIssue: issues.length > 0 ? totalComments / issues.length : 0,
      hasWiki: repo.has_wiki,
      hasDiscussions: repo.has_discussions
    };

    // Scoring
    const contributorScore = Math.min(uniqueContributors * 2, 30); // Max 30 points
    const coreContributorScore = Math.min(coreContributors * 5, 25); // Max 25 points
    const externalScore = Math.min(externalContributors * 3, 20); // Max 20 points
    const engagementScore = Math.min(totalComments / 10, 15); // Max 15 points
    
    // Bonus for community features
    let communityFeatures = 0;
    if (repo.has_wiki) communityFeatures += 5;
    if (repo.has_discussions) communityFeatures += 5;

    const score = Math.min(
      contributorScore + coreContributorScore + externalScore + engagementScore + communityFeatures,
      100
    );

    return {
      score: Math.round(score),
      metrics,
      breakdown: {
        contributors: Math.round(contributorScore),
        coreContributors: Math.round(coreContributorScore),
        external: Math.round(externalScore),
        engagement: Math.round(engagementScore),
        features: communityFeatures
      }
    };
  }

  calculateOverallScore(metrics) {
    // Weighted average of all scores
    const weights = {
      popularity: 0.2,
      activity: 0.25,
      maintenance: 0.25,
      security: 0.15,
      community: 0.15
    };

    const overall = 
      metrics.popularity.score * weights.popularity +
      metrics.activity.score * weights.activity +
      metrics.maintenance.score * weights.maintenance +
      metrics.security.score * weights.security +
      metrics.community.score * weights.community;

    return Math.round(overall);
  }
}

module.exports = new MetricsCalculator();
