const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');
const githubService = require('./services/githubService');
const packageService = require('./services/packageService');
const metricsCalculator = require('./utils/metricsCalculator');

dotenv.config({ path: './server/.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Cache for 10 minutes
const cache = new NodeCache({ stdTTL: 600 });

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.get('/api/analyze/:owner/:repo', async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const cacheKey = `${owner}/${repo}`;
    
    // Check cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    console.log(`Analyzing repository: ${owner}/${repo}`);

    // Fetch data from multiple sources
    const [
      repoData,
      contributorsData,
      contributorStatsData,
      issuesData,
      pullRequestsData,
      releasesData,
      securityData,
      packageData
    ] = await Promise.allSettled([
      githubService.getRepositoryInfo(owner, repo),
      githubService.getContributors(owner, repo),
      githubService.getContributorStats(owner, repo),
      githubService.getIssues(owner, repo),
      githubService.getPullRequests(owner, repo),
      githubService.getReleases(owner, repo),
      githubService.getSecurityAdvisories(owner, repo),
      packageService.getPackageInfo(owner, repo)
    ]);

    // Extract successful results
    const results = {
      repository: repoData.status === 'fulfilled' ? repoData.value : null,
      contributors: contributorsData.status === 'fulfilled' ? contributorsData.value : [],
      contributorStats: contributorStatsData.status === 'fulfilled' ? contributorStatsData.value : [],
      issues: issuesData.status === 'fulfilled' ? issuesData.value : [],
      pullRequests: pullRequestsData.status === 'fulfilled' ? pullRequestsData.value : [],
      releases: releasesData.status === 'fulfilled' ? releasesData.value : [],
      security: securityData.status === 'fulfilled' ? securityData.value : [],
      packageInfo: packageData.status === 'fulfilled' ? packageData.value : null
    };

    if (!results.repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    // Calculate comprehensive metrics
    const metrics = metricsCalculator.calculateAllMetrics(results);
    
    const response = {
      repository: results.repository,
      metrics,
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    cache.set(cacheKey, response);
    
    res.json(response);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze repository',
      message: error.message 
    });
  }
});

// Get trending repositories for suggestions
app.get('/api/trending', async (req, res) => {
  try {
    const trending = await githubService.getTrendingRepositories();
    res.json(trending);
  } catch (error) {
    console.error('Trending fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch trending repositories' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 OSS Health Dashboard server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  
  if (!process.env.GITHUB_TOKEN) {
    console.warn('⚠️  Warning: GITHUB_TOKEN not set. API rate limits will be severely restricted.');
    console.log('   Get a token at: https://github.com/settings/tokens');
  }
});
