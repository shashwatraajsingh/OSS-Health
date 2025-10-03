import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import TrendingRepos from './components/TrendingRepos';
import ComparisonView from './components/ComparisonView';
import { analyzeRepository } from './services/api';
import './index.css';

function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'dashboard', 'compare'
  const [comparisonRepos, setComparisonRepos] = useState([]);

  const handleAnalyze = async (repoUrl) => {
    setLoading(true);
    setError(null);
    setAnalysisData(null);

    try {
      // Extract owner and repo from GitHub URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('Please enter a valid GitHub repository URL');
      }

      const [, owner, repo] = match;
      const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git suffix if present

      const data = await analyzeRepository(owner, cleanRepo);
      setAnalysisData(data);
      setCurrentView('dashboard');
    } catch (err) {
      setError(err.message || 'Failed to analyze repository');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    setCurrentView('home');
  };

  const handleAddToComparison = (data) => {
    if (comparisonRepos.length < 4) { // Limit to 4 repos for comparison
      setComparisonRepos([...comparisonRepos, data]);
      setCurrentView('compare');
    }
  };

  const handleRemoveFromComparison = (index) => {
    const newRepos = comparisonRepos.filter((_, i) => i !== index);
    setComparisonRepos(newRepos);
    if (newRepos.length === 0) {
      setCurrentView('home');
    }
  };

  const handleSelectTrendingRepo = (repoUrl) => {
    handleAnalyze(repoUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        comparisonCount={comparisonRepos.length}
      />
      
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setCurrentView('home')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            {analysisData && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
            )}
            <button
              onClick={() => setCurrentView('compare')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentView === 'compare'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compare ({comparisonRepos.length})
            </button>
          </nav>
        </div>

        {currentView === 'home' && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  OSS Health Dashboard
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Analyze open-source projects beyond just GitHub stars. Get comprehensive 
                  health metrics including popularity, activity, maintenance, security, and community engagement.
                </p>
              </div>
              
              <SearchForm onAnalyze={handleAnalyze} />
              
              {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">⭐</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Popularity</h3>
                  <p className="text-gray-600 text-sm">Stars, forks, downloads from npm/PyPI</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">📈</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Activity</h3>
                  <p className="text-gray-600 text-sm">Commits, PRs, releases, and recency</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">🛠️</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Maintenance</h3>
                  <p className="text-gray-600 text-sm">Issue management and PR handling</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
                  <p className="text-gray-600 text-sm">Advisories, Dependabot, security policies</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 text-sm">Contributors, engagement, discussions</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-semibold text-gray-900 mb-2">Overall Score</h3>
                  <p className="text-gray-600 text-sm">Weighted composite health rating</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TrendingRepos onSelectRepo={handleSelectTrendingRepo} />
            </div>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {currentView === 'dashboard' && analysisData && (
          <Dashboard 
            data={analysisData} 
            onReset={handleReset}
            onAddToComparison={handleAddToComparison}
          />
        )}

        {currentView === 'compare' && (
          <ComparisonView
            repositories={comparisonRepos}
            onRemove={handleRemoveFromComparison}
            onAddNew={() => setCurrentView('home')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
