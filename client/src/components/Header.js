import React from 'react';
import { Github, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './theme-toggle';

const Header = ({ currentView, onViewChange, comparisonCount }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Brand */}
        <div className="mr-4 flex">
          <a
            href="/"
            className="mr-6 flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              onViewChange?.('home');
            }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden font-bold sm:inline-block">
              OSS Health
            </div>
          </a>
        </div>

        {/* Navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Button
              variant={currentView === 'home' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('home')}
            >
              Home
            </Button>
            <Button
              variant={currentView === 'compare' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewChange?.('compare')}
            >
              Compare {comparisonCount > 0 && `(${comparisonCount})`}
            </Button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/shashwatraajsingh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;



