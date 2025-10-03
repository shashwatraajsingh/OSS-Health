const axios = require('axios');

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OSS-Health-Dashboard'
    };
    
    if (process.env.GITHUB_TOKEN) {
      this.headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
      console.log(`✅ GitHub Service initialized with authentication`);
    } else {
      console.warn('⚠️ GitHub Service initialized without authentication - rate limits will apply');
    }
  }

  async makeRequest(endpoint) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: this.headers,
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.message;
        
        if (status === 403) {
          console.error(`🚫 GitHub API 403 Forbidden for ${endpoint}:`);
          console.error(`   Message: ${message}`);
          if (message.includes('rate limit')) {
            console.error('   💡 Rate limit exceeded. Consider adding a GitHub token.');
          } else if (message.includes('private') || message.includes('access')) {
            console.error('   💡 Repository may be private or token lacks permissions.');
          }
        } else if (status === 404) {
          console.error(`❌ GitHub API 404 Not Found for ${endpoint}: Repository or resource not found`);
        } else {
          console.error(`GitHub API error ${status} for ${endpoint}: ${message}`);
        }
      } else {
        console.error(`GitHub API error for ${endpoint}:`, error.message);
      }
      throw error;
    }
  }

  async getRepositoryInfo(owner, repo) {
    return await this.makeRequest(`/repos/${owner}/${repo}`);
  }

  async getContributors(owner, repo) {
    let allContributors = [];
    let page = 1;
    const perPage = 100;
    
    try {
      console.log(`Fetching ALL contributors for ${owner}/${repo}...`);
      
      while (true) {
        console.log(`Fetching contributors page ${page}...`);
        
        const contributors = await this.makeRequest(
          `/repos/${owner}/${repo}/contributors?page=${page}&per_page=${perPage}&anon=true`
        );
        
        if (!contributors || contributors.length === 0) {
          console.log(`No more contributors found. Total pages fetched: ${page - 1}`);
          break;
        }
        
        allContributors = allContributors.concat(contributors);
        console.log(`Page ${page}: Found ${contributors.length} contributors. Total so far: ${allContributors.length}`);
        
        // If we got less than perPage results, we've reached the end
        if (contributors.length < perPage) {
          console.log(`Reached end of contributors. Final count: ${allContributors.length}`);
          break;
        }
        
        page++;
        
        // Safety check: If we've fetched more than 100 pages (10,000 contributors), 
        // that's likely enough for analysis purposes
        if (page > 100) {
          console.log(`⚠️ Reached safety limit of 100 pages (${allContributors.length} contributors). Stopping fetch.`);
          break;
        }
        
        // Add a small delay to avoid rate limiting
        if (page % 10 === 0) {
          console.log(`⏸️ Pausing briefly after ${page - 1} pages to avoid rate limiting...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      console.log(`✅ Successfully fetched ${allContributors.length} total contributors for ${owner}/${repo}`);
      return allContributors;
    } catch (error) {
      console.error(`Error fetching contributors for ${owner}/${repo}:`, error.message);
      return [];
    }
  }

  async getIssues(owner, repo, state = 'all', page = 1, perPage = 100) {
    const issues = await this.makeRequest(
      `/repos/${owner}/${repo}/issues?state=${state}&page=${page}&per_page=${perPage}&sort=updated&direction=desc`
    );
    return issues;
  }

  async getPullRequests(owner, repo, state = 'all', page = 1, perPage = 100) {
    const prs = await this.makeRequest(
      `/repos/${owner}/${repo}/pulls?state=${state}&page=${page}&per_page=${perPage}&sort=updated&direction=desc`
    );
    return prs;
  }

  async getReleases(owner, repo, page = 1, perPage = 30) {
    const releases = await this.makeRequest(
      `/repos/${owner}/${repo}/releases?page=${page}&per_page=${perPage}`
    );
    return releases;
  }

  async getCommits(owner, repo, since = null, page = 1, perPage = 100) {
    let endpoint = `/repos/${owner}/${repo}/commits?page=${page}&per_page=${perPage}`;
    if (since) {
      endpoint += `&since=${since}`;
    }
    const commits = await this.makeRequest(endpoint);
    return commits;
  }

  async getSecurityAdvisories(owner, repo) {
    try {
      // GitHub Security Advisories API
      const advisories = await this.makeRequest(
        `/repos/${owner}/${repo}/security-advisories`
      );
      return advisories;
    } catch (error) {
      // Security advisories might not be available for all repos
      console.log(`No security advisories found for ${owner}/${repo}`);
      return [];
    }
  }

  async getVulnerabilityAlerts(owner, repo) {
    try {
      // Requires special permissions
      const alerts = await this.makeRequest(
        `/repos/${owner}/${repo}/vulnerability-alerts`
      );
      return alerts;
    } catch (error) {
      console.log(`Vulnerability alerts not accessible for ${owner}/${repo}`);
      return [];
    }
  }

  async getTrendingRepositories(language = '', since = 'daily') {
    try {
      const query = language ? `language:${language}` : '';
      const response = await this.makeRequest(
        `/search/repositories?q=${query}&sort=stars&order=desc&per_page=10`
      );
      return response.items;
    } catch (error) {
      console.error('Error fetching trending repositories:', error.message);
      return [];
    }
  }

  async getRecentCommits(owner, repo, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    
    try {
      const commits = await this.getCommits(owner, repo, since.toISOString());
      return commits;
    } catch (error) {
      console.error(`Error fetching recent commits for ${owner}/${repo}:`, error.message);
      return [];
    }
  }

  async getLanguages(owner, repo) {
    try {
      const languages = await this.makeRequest(`/repos/${owner}/${repo}/languages`);
      return languages;
    } catch (error) {
      console.error(`Error fetching languages for ${owner}/${repo}:`, error.message);
      return {};
    }
  }

  async getContributorStats(owner, repo) {
    try {
      console.log(`Fetching contributor statistics for ${owner}/${repo}...`);
      
      // This endpoint provides more detailed contributor statistics
      // Note: This endpoint can be slow for large repos and may return 202 (processing)
      const stats = await this.makeRequest(`/repos/${owner}/${repo}/stats/contributors`);
      
      if (stats && Array.isArray(stats)) {
        console.log(`✅ Successfully fetched detailed stats for ${stats.length} contributors`);
        return stats;
      } else {
        console.log(`⚠️ Contributor stats not available or still processing for ${owner}/${repo}`);
        return [];
      }
    } catch (error) {
      console.error(`Error fetching contributor stats for ${owner}/${repo}:`, error.message);
      return [];
    }
  }
}

module.exports = new GitHubService();
