'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
  title: string;
  description: string;
  url: string;
  icon: string;
  category: string;
}

export default function DashboardSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // All searchable items in the dashboard
  const searchableItems: SearchResult[] = [
    // Navigation
    { title: 'Dashboard', description: 'Overview and statistics', url: '/dashboard', icon: 'bi-grid-fill', category: 'Navigation' },
    { title: 'Portfolio', description: 'Manage portfolio projects', url: '/dashboard/portfolio', icon: 'bi-briefcase', category: 'Navigation' },
    { title: 'Brands', description: 'Manage brand partners', url: '/dashboard/brands', icon: 'bi-award', category: 'Navigation' },
    { title: 'Clients', description: 'Manage clients', url: '/dashboard/clients', icon: 'bi-people', category: 'Navigation' },
    { title: 'Themes', description: 'Manage themes', url: '/dashboard/themes', icon: 'bi-palette', category: 'Navigation' },
    { title: 'Blog', description: 'Manage blog posts', url: '/dashboard/blog', icon: 'bi-file-earmark-text', category: 'Navigation' },
    { title: 'Comments', description: 'Moderate blog comments', url: '/dashboard/blog/comments', icon: 'bi-chat-dots', category: 'Navigation' },
    { title: 'Messages', description: 'View contact messages', url: '/dashboard/contacts', icon: 'bi-envelope', category: 'Navigation' },
    { title: 'Analytics', description: 'Website analytics', url: '/dashboard/analytics', icon: 'bi-graph-up', category: 'Navigation' },
    { title: 'Users', description: 'Manage users', url: '/dashboard/users', icon: 'bi-person-gear', category: 'Navigation' },
    { title: 'Settings', description: 'Account settings', url: '/dashboard/settings', icon: 'bi-gear', category: 'Navigation' },
    
    // Actions
    { title: 'Add Portfolio Item', description: 'Create new portfolio project', url: '/dashboard/portfolio', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Add Brand', description: 'Add new brand partner', url: '/dashboard/brands', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Add Client', description: 'Add new client', url: '/dashboard/clients', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Add Theme', description: 'Upload new theme', url: '/dashboard/themes', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Write Blog Post', description: 'Create new blog post', url: '/dashboard/blog', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Create User', description: 'Add new user', url: '/dashboard/users', icon: 'bi-plus-circle', category: 'Actions' },
    
    // Frontend
    { title: 'View Website', description: 'Go to frontend', url: '/', icon: 'bi-house', category: 'Frontend' },
    { title: 'View Blog', description: 'Public blog page', url: '/blog', icon: 'bi-newspaper', category: 'Frontend' },
    { title: 'View Portfolio', description: 'Public portfolio page', url: '/portfolio', icon: 'bi-briefcase', category: 'Frontend' },
    { title: 'View Themes', description: 'Public themes page', url: '/themes', icon: 'bi-palette', category: 'Frontend' },
  ];

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = searchQuery.toLowerCase();
    const filtered = searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  };

  // Handle search input
  useEffect(() => {
    performSearch(query);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = (url: string) => {
    router.push(url);
    setIsOpen(false);
    setQuery('');
  };

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={searchRef} style={{ position: 'relative' }}>
      <i
        className="bi bi-search text-secondary"
        style={{ cursor: 'pointer', fontSize: '18px' }}
        onClick={handleOpen}
        title="Search (Ctrl+K)"
      ></i>

      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1040,
            }}
            onClick={() => setIsOpen(false)}
          ></div>

          <div
            style={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '600px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              zIndex: 1050,
              overflow: 'hidden',
            }}
          >
            {/* Search Input */}
            <div style={{ padding: '20px', borderBottom: '1px solid #e9ecef' }}>
              <div className="input-group">
                <span className="input-group-text bg-white border-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control border-0"
                  placeholder="Search dashboard... (Ctrl+K)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ fontSize: '16px', boxShadow: 'none' }}
                />
                <button
                  className="btn btn-sm"
                  onClick={() => setIsOpen(false)}
                  style={{ border: 'none' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div
              style={{
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '10px',
              }}
            >
              {query && results.length === 0 && (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-search display-4 d-block mb-3"></i>
                  <p>No results found for "{query}"</p>
                </div>
              )}

              {!query && (
                <div className="p-3">
                  <small className="text-muted text-uppercase fw-semibold">Quick Links</small>
                  <div className="mt-2">
                    {searchableItems.slice(0, 6).map((item, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center gap-3 p-2 rounded"
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => handleResultClick(item.url)}
                      >
                        <i className={`${item.icon} text-primary`} style={{ fontSize: '20px' }}></i>
                        <div>
                          <div className="fw-semibold">{item.title}</div>
                          <small className="text-muted">{item.description}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  {Object.entries(
                    results.reduce((acc, item) => {
                      if (!acc[item.category]) acc[item.category] = [];
                      acc[item.category].push(item);
                      return acc;
                    }, {} as Record<string, SearchResult[]>)
                  ).map(([category, items]) => (
                    <div key={category} className="mb-3">
                      <small className="text-muted text-uppercase fw-semibold px-3">{category}</small>
                      <div className="mt-2">
                        {items.map((item, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center gap-3 p-2 px-3 rounded"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            onClick={() => handleResultClick(item.url)}
                          >
                            <i className={`${item.icon} text-primary`} style={{ fontSize: '20px' }}></i>
                            <div className="flex-grow-1">
                              <div className="fw-semibold">{item.title}</div>
                              <small className="text-muted">{item.description}</small>
                            </div>
                            <i className="bi bi-arrow-right text-muted"></i>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '10px 20px',
                borderTop: '1px solid #e9ecef',
                backgroundColor: '#f8f9fa',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <small className="text-muted">
                <kbd>↑</kbd> <kbd>↓</kbd> to navigate · <kbd>Enter</kbd> to select · <kbd>Esc</kbd> to close
              </small>
              <small className="text-muted">
                <kbd>Ctrl</kbd> + <kbd>K</kbd> to open
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
