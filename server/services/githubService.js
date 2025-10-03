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
      console.error(`GitHub API error for ${endpoint}:`, error.message);
      throw error;
    }
  }

  async getRepositoryInfo(owner, repo) {
    return await this.makeRequest(`/repos/${owner}/${repo}`);
  }

  async getContributors(owner, repo, maxPages = 3) {
    let allContributors = [];
    let page = 1;
    const perPage = 100;
    
    try {
      while (page <= maxPages) {
        const contributors = await this.makeRequest(
          `/repos/${owner}/${repo}/contributors?page=${page}&per_page=${perPage}&anon=true`
        );
        
        if (!contributors || contributors.length === 0) {
          break;
        }
        
        allContributors = allContributors.concat(contributors);
        
        // If we got less than perPage results, we've reached the end
        if (contributors.length < perPage) {
          break;
        }
        
        page++;
      }
      
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
      // This endpoint provides more detailed contributor statistics
      const stats = await this.makeRequest(`/repos/${owner}/${repo}/stats/contributors`);
      return stats || [];
    } catch (error) {
      console.error(`Error fetching contributor stats for ${owner}/${repo}:`, error.message);
      return [];
    }
  }
}

module.exports = new GitHubService();
