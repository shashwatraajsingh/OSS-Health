import React from 'react';
import { Github, Activity } from 'lucide-react';

type HeaderProps = {
  currentView?: string;
  onViewChange?: (view: string) => void;
  comparisonCount?: number;
};

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, comparisonCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <a
            href="/"
            className="group flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md"
            aria-label="OSS Health Home"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 ring-1 ring-primary-600/10 shadow-sm">
              <Activity className="h-5 w-5 text-white transition-transform duration-200 group-hover:scale-105" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight text-gray-900">
                OSS Health
              </span>
              <span className="text-xs text-gray-500">
                Project Health Analytics
              </span>
            </div>
          </a>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
            >
              <Github className="h-4.5 w-4.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;



