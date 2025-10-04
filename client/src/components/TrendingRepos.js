import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, GitFork, ExternalLink } from 'lucide-react';
import { getTrendingRepositories } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const TrendingRepos = ({ onSelectRepo }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const repos = await getTrendingRepositories();
        setTrending(repos.slice(0, 6)); // Show top 6
      } catch (err) {
        setError('Failed to fetch trending repositories');
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Repositories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Repositories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trending.map((repo) => (
            <Card
              key={repo.id || repo.full_name}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => onSelectRepo(repo.html_url)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium hover:text-primary transition-colors">
                        {repo.full_name}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                    
                    {repo.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {repo.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{repo.stargazers_count?.toLocaleString()}</span>
                      </div>
                      {repo.forks_count && (
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          <span>{repo.forks_count?.toLocaleString()}</span>
                        </div>
                      )}
                      {repo.language && (
                        <Badge variant="secondary" className="text-xs">
                          {repo.language}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Button variant="ghost" size="sm">
            View More Trending →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingRepos;
