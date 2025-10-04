import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import Dashboard from './components/Dashboard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import TrendingRepos from './components/TrendingRepos';
import ComparisonView from './components/ComparisonView';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { analyzeRepository } from './services/api';
import { Star, TrendingUp, Wrench, Shield, Users, BarChart3 } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView}
        onViewChange={setCurrentView}
        comparisonCount={comparisonRepos.length}
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={currentView} onValueChange={setCurrentView} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="dashboard" disabled={!analysisData}>
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="compare">
                Compare ({comparisonRepos.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="home" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight mb-4">
                    OSS Health Dashboard
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Analyze open-source projects beyond just GitHub stars. Get comprehensive 
                    health metrics including popularity, activity, maintenance, security, and community engagement.
                  </p>
                </div>
                
                <SearchForm onAnalyze={handleAnalyze} />
                
                {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Star className="h-8 w-8 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Popularity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Stars, forks, downloads from npm/PyPI
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Commits, PRs, releases, and recency
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Wrench className="h-8 w-8 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Maintenance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Issue management and PR handling
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Shield className="h-8 w-8 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Advisories, Dependabot, security policies
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <Users className="h-8 w-8 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Contributors, engagement, discussions
                      </CardDescription>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader className="pb-2">
                      <BarChart3 className="h-8 w-8 mx-auto text-primary mb-2" />
                      <CardTitle className="text-lg">Overall Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Weighted composite health rating
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <TrendingRepos onSelectRepo={handleSelectTrendingRepo} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            {loading && <LoadingSpinner />}
            {analysisData && (
              <Dashboard 
                data={analysisData} 
                onReset={handleReset}
                onAddToComparison={handleAddToComparison}
              />
            )}
          </TabsContent>

          <TabsContent value="compare">
            <ComparisonView
              repositories={comparisonRepos}
              onRemove={handleRemoveFromComparison}
              onAddNew={() => setCurrentView('home')}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;
