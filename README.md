# OSS Health Dashboard

A comprehensive web application for evaluating open-source project health metrics beyond just GitHub stars.

## Features

- **📊 Comprehensive Metrics**: Analyze popularity, activity, maintenance, security, and community health
- **🔍 Multi-Platform Support**: GitHub repositories with npm/PyPI package integration
- **📈 Visual Dashboard**: Interactive charts and scorecards for easy analysis
- **🚀 Real-time Data**: Live fetching from GitHub API and package registries
- **🔄 Repository Comparison**: Side-by-side analysis of multiple repositories
- **🎯 Health Insights**: AI-powered recommendations and insights
- **📋 Trending Repositories**: Discover popular projects to analyze
- **💾 Export Functionality**: Download reports in JSON/CSV format
- **🎨 Modern UI**: Responsive design with Tailwind CSS

## Metrics Evaluated

### ⭐ Popularity
- GitHub stars and forks
- Package downloads (npm/PyPI)
- Repository watchers

### 📈 Activity  
- Recent commits frequency
- Pull request activity
- Release recency and frequency

### 🛠️ Maintenance
- Open vs closed issues ratio
- Stale pull requests
- Response time to issues

### 🔒 Security
- Security advisories
- Dependabot alerts
- Known vulnerabilities

### 👥 Community
- Number of contributors
- Discussion activity
- Community engagement metrics

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your GitHub token
   ```

3. **Get a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Create a new token with `repo` and `security_events` scopes
   - Add it to your `.env` file

4. **Run the application:**
   ```bash
   npm run dev
   ```

5. **Access the dashboard:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

### Basic Analysis
1. Enter a GitHub repository URL (e.g., `facebook/react`)
2. Click "Analyze" to fetch comprehensive health metrics
3. View the interactive dashboard with scores and visualizations
4. Export detailed reports in JSON format

### Advanced Features
- **Repository Comparison**: Add multiple repositories to compare their health metrics side by side
- **Trending Discovery**: Browse trending repositories from the sidebar
- **Health Insights**: Get AI-powered recommendations for improving project health
- **Export Reports**: Download analysis results in JSON or CSV format

### Navigation
- **Home**: Search and analyze repositories
- **Dashboard**: View detailed analysis results
- **Compare**: Side-by-side repository comparison

## API Endpoints

- `GET /api/analyze/:owner/:repo` - Get comprehensive project analysis
- `GET /api/trending` - Get trending repositories
- `GET /api/health-check` - Server health check

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, Axios, Node-Cache
- **APIs**: GitHub API, npm Registry, PyPI API
- **Features**: Real-time data, caching, responsive design, export functionality
