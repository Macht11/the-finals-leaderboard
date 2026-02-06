'use client';

import { Github, Twitter, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-black mb-2">
              <span className="gradient-text">THE FINALS</span>
            </h3>
            <p className="text-sm text-text-secondary">
              Professional ranked leaderboard and statistics tracker for THE FINALS competitive scene.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.reachthefinals.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-white transition-colors flex items-center gap-1"
                >
                  Official Website <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.thefinals.wiki/wiki/Main_Page" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-white transition-colors flex items-center gap-1"
                >
                  THE FINALS Wiki <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://api.the-finals-leaderboard.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-white transition-colors flex items-center gap-1"
                >
                  API Documentation <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Community</h4>
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/leonlarsson/the-finals-api"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-white hover:bg-surface-hover transition-all"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.reddit.com/r/thefinals/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-surface-light flex items-center justify-center text-text-secondary hover:text-white hover:bg-surface-hover transition-all"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted text-center sm:text-left">
            Data provided by <a href="https://api.the-finals-leaderboard.com/" className="text-primary hover:underline">the-finals-api</a>. 
            Not affiliated with Embark Studios.
          </p>
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} THE FINALS Companion
          </p>
        </div>
      </div>
    </footer>
  );
}
