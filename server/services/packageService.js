const axios = require('axios');

class PackageService {
  constructor() {
    this.npmBaseURL = 'https://registry.npmjs.org';
    this.pypiBaseURL = 'https://pypi.org/pypi';
  }

  async getPackageInfo(owner, repo) {
    // Try to detect package type and get package info
    const packageInfo = {
      npm: null,
      pypi: null,
      downloads: {
        npm: 0,
        pypi: 0,
        total: 0
      }
    };

    // Try npm first (most common for JS projects)
    try {
      const npmInfo = await this.getNpmPackageInfo(repo);
      if (npmInfo) {
        packageInfo.npm = npmInfo;
        const downloads = await this.getNpmDownloads(repo);
        packageInfo.downloads.npm = downloads;
        packageInfo.downloads.total += downloads;
      }
    } catch (error) {
      console.log(`No npm package found for ${repo}`);
    }

    // Try PyPI (for Python projects)
    try {
      const pypiInfo = await this.getPypiPackageInfo(repo);
      if (pypiInfo) {
        packageInfo.pypi = pypiInfo;
        // PyPI doesn't provide download stats easily, but we can get some info
        packageInfo.downloads.pypi = 0; // Would need pypistats.org for actual downloads
      }
    } catch (error) {
      console.log(`No PyPI package found for ${repo}`);
    }

    return packageInfo.npm || packageInfo.pypi ? packageInfo : null;
  }

  async getNpmPackageInfo(packageName) {
    try {
      const response = await axios.get(`${this.npmBaseURL}/${packageName}`, {
        timeout: 5000
      });
      
      const data = response.data;
      return {
        name: data.name,
        version: data['dist-tags']?.latest,
        description: data.description,
        keywords: data.keywords || [],
        license: data.license,
        homepage: data.homepage,
        repository: data.repository,
        maintainers: data.maintainers || [],
        created: data.time?.created,
        modified: data.time?.modified,
        versions: Object.keys(data.versions || {}).length
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async getNpmDownloads(packageName, period = 'last-month') {
    try {
      const response = await axios.get(
        `https://api.npmjs.org/downloads/point/${period}/${packageName}`,
        { timeout: 5000 }
      );
      return response.data.downloads || 0;
    } catch (error) {
      console.log(`Could not fetch npm downloads for ${packageName}`);
      return 0;
    }
  }

  async getPypiPackageInfo(packageName) {
    try {
      const response = await axios.get(`${this.pypiBaseURL}/${packageName}/json`, {
        timeout: 5000
      });
      
      const data = response.data;
      return {
        name: data.info.name,
        version: data.info.version,
        description: data.info.summary,
        keywords: data.info.keywords?.split(',') || [],
        license: data.info.license,
        homepage: data.info.home_page,
        author: data.info.author,
        maintainer: data.info.maintainer,
        classifiers: data.info.classifiers || [],
        releases: Object.keys(data.releases || {}).length
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Alternative package names to try
  getAlternativeNames(repoName) {
    const alternatives = [
      repoName,
      repoName.toLowerCase(),
      repoName.replace(/-/g, '_'), // Python style
      repoName.replace(/_/g, '-'), // npm style
      `@${repoName}`, // scoped package
    ];
    
    return [...new Set(alternatives)]; // Remove duplicates
  }

  async searchPackages(query, registry = 'npm') {
    try {
      if (registry === 'npm') {
        const response = await axios.get(
          `https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(query)}&size=5`,
          { timeout: 5000 }
        );
        return response.data.objects || [];
      } else if (registry === 'pypi') {
        const response = await axios.get(
          `https://pypi.org/simple/${encodeURIComponent(query)}/`,
          { timeout: 5000 }
        );
        // PyPI search is more limited, would need different approach
        return [];
      }
    } catch (error) {
      console.log(`Package search failed for ${query} on ${registry}`);
      return [];
    }
  }
}

module.exports = new PackageService();
