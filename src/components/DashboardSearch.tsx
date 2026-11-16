'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DASH_NAV } from './dashboardNav';

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
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Every dashboard page (from the shared nav) + quick actions + public pages
  const searchableItems: SearchResult[] = [
    ...DASH_NAV.flatMap((g) => g.items.map((i) => ({
      title: i.label, description: i.description, url: i.href, icon: i.icon, category: g.title,
    }))),
    { title: 'Write Blog Post', description: 'Create a new article', url: '/dashboard/blog', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Add Portfolio Item', description: 'Add a new project', url: '/dashboard/portfolio', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Add Laravel Project', description: 'Add a new case study', url: '/dashboard/laravel-projects', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'Add Product', description: 'Add a new template', url: '/dashboard/products', icon: 'bi-plus-circle', category: 'Actions' },
    { title: 'View Website', description: 'Open the public site', url: '/', icon: 'bi-globe2', category: 'Website' },
    { title: 'View Blog', description: 'Public blog page', url: '/blog', icon: 'bi-newspaper', category: 'Website' },
    { title: 'View Portfolio', description: 'Public portfolio page', url: '/portfolio', icon: 'bi-briefcase', category: 'Website' },
  ];

  // Results are derived from the query (no extra state/effect needed)
  const q = query.trim().toLowerCase();
  const results = q
    ? searchableItems
        .filter((item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q))
        .slice(0, 8)
    : [];

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
      <button type="button" className="dash-search-trigger" onClick={handleOpen} aria-label="Search the dashboard (Ctrl+K)">
        <i className="bi bi-search" aria-hidden="true" />
        <span className="dash-search-trigger__text">Search…</span>
        <kbd className="dash-search-trigger__kbd">Ctrl K</kbd>
      </button>

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
                  <p>No results found for &ldquo;{query}&rdquo;</p>
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
