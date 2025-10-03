// Load environment variables FIRST before requiring any services
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Check for .env file in multiple locations
const envPaths = [
  path.join(__dirname, '.env'),           // server/.env
  path.join(__dirname, '../.env'),        // root/.env
  './.env',                               // current directory
  './server/.env'                         // server directory from root
];

let envLoaded = false;
for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`📁 Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.warn('⚠️ No .env file found in any expected location');
  dotenv.config(); // Try default behavior
}

// Now require services AFTER environment is loaded
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');
const githubService = require('./services/githubService');
const packageService = require('./services/packageService');
const metricsCalculator = require('./utils/metricsCalculator');

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
      console.log(`📋 Serving cached result for ${owner}/${repo}`);
      return res.json(cachedResult);
    }

    console.log(`🔍 Analyzing repository: ${owner}/${repo} (fetching ALL contributors)`);

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
      // Check if we got 403 errors (private repo or permission issues)
      if (repoData.status === 'rejected' && repoData.reason?.response?.status === 403) {
        return res.status(403).json({ 
          error: 'Repository access denied',
          message: 'This repository is private or your GitHub token lacks the necessary permissions. Please ensure your token has access to this repository.'
        });
      }
      return res.status(404).json({ 
        error: 'Repository not found',
        message: 'The specified repository does not exist or is not accessible.'
      });
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
  } else {
    console.log(`✅ GitHub token loaded: ${process.env.GITHUB_TOKEN.substring(0, 8)}...`);
    console.log('🔑 Enhanced API access enabled with higher rate limits');
  }
});
