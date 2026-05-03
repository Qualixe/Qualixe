'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import './SearchIcon.css';

interface SearchResult {
  type: 'blog' | 'portfolio' | 'service' | 'product';
  title: string;
  excerpt?: string;
  url: string;
  image?: string;
}

const SERVICES: SearchResult[] = [
  { type: 'service', title: 'Shopify Development', excerpt: 'Custom Shopify stores built to convert', url: '/services/shopify-development' },
  { type: 'service', title: 'Digital Marketing',   excerpt: 'SEO, paid ads, and social media campaigns', url: '/services/digital-marketing' },
  { type: 'service', title: 'UI/UX Design',         excerpt: 'Beautiful, intuitive digital experiences', url: '/services/uiux-design' },
];

export default function SearchIcon() {
  const router = useRouter();
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [loading, setLoading]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);
  const wrapRef                 = useRef<HTMLDivElement>(null);
  const debounceRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else { setQuery(''); setResults([]); }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);

    const term = q.toLowerCase().trim();

    try {
      // Run all queries in parallel
      const [blogRes, portfolioRes, productRes] = await Promise.allSettled([
        supabase
          .from('blog_posts')
          .select('title, excerpt, slug, featured_image')
          .eq('status', 'published')
          .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,tags.cs.{${term}}`)
          .limit(4),

        supabase
          .from('portfolio')
          .select('title, image_url, project_url, category')
          .ilike('title', `%${term}%`)
          .limit(3),

        supabase
          .from('products')
          .select('name, tagline, preview_url')
          .eq('active', true)
          .or(`name.ilike.%${term}%,tagline.ilike.%${term}%,description.ilike.%${term}%`)
          .limit(3),
      ]);

      const out: SearchResult[] = [];

      // Blog posts
      if (blogRes.status === 'fulfilled' && blogRes.value.data) {
        blogRes.value.data.forEach((p: any) => out.push({
          type: 'blog',
          title: p.title,
          excerpt: p.excerpt,
          url: `/blog/${p.slug}`,
          image: p.featured_image,
        }));
      }

      // Portfolio
      if (portfolioRes.status === 'fulfilled' && portfolioRes.value.data) {
        portfolioRes.value.data.forEach((p: any) => out.push({
          type: 'portfolio',
          title: p.title,
          excerpt: p.category,
          url: p.project_url,
          image: p.image_url,
        }));
      }

      // Products
      if (productRes.status === 'fulfilled' && productRes.value.data) {
        productRes.value.data.forEach((p: any) => out.push({
          type: 'product',
          title: p.name,
          excerpt: p.tagline,
          url: '/shop',
          image: p.preview_url,
        }));
      }

      // Static services filter
      const matchedServices = SERVICES.filter(s =>
        s.title.toLowerCase().includes(term) ||
        (s.excerpt?.toLowerCase().includes(term))
      );

      setResults([...matchedServices, ...out]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(() => search(val), 320);
  }

  function handleSelect(url: string) {
    setOpen(false);
    if (url.startsWith('http')) window.open(url, '_blank');
    else router.push(url);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/blog?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  }

  const typeLabel: Record<string, string> = {
    service: 'Service', blog: 'Blog', portfolio: 'Portfolio', product: 'Template',
  };
  const typeIcon: Record<string, string> = {
    service: 'bi-gear', blog: 'bi-file-earmark-text',
    portfolio: 'bi-briefcase', product: 'bi-file-zip',
  };

  return (
    <div className="search-wrap" ref={wrapRef}>
      {/* Toggle button */}
      <button
        className={`search-icon-btn ${open ? 'search-icon-btn--active' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close search' : 'Open search'}
        aria-expanded={open}
      >
        {open ? <X size={20} /> : <Search size={20} />}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="search-panel" role="dialog" aria-label="Search">
          <form onSubmit={handleSubmit} className="search-panel__form">
            <Search size={16} className="search-panel__icon" />
            <input
              ref={inputRef}
              type="search"
              className="search-panel__input"
              placeholder="Search pages, blog, templates…"
              value={query}
              onChange={handleChange}
              autoComplete="off"
            />
            {loading && <span className="search-panel__spinner" />}
          </form>

          {/* Results */}
          {query.trim() && (
            <div className="search-results">
              {results.length === 0 && !loading ? (
                <div className="search-results__empty">
                  No results for "<strong>{query}</strong>"
                </div>
              ) : (
                results.map((r, i) => (
                  <button
                    key={i}
                    className="search-result"
                    onClick={() => handleSelect(r.url)}
                  >
                    {r.image ? (
                      <img src={r.image} alt="" className="search-result__img" />
                    ) : (
                      <div className="search-result__icon">
                        <i className={`bi ${typeIcon[r.type]}`} />
                      </div>
                    )}
                    <div className="search-result__body">
                      <span className="search-result__title">{r.title}</span>
                      {r.excerpt && (
                        <span className="search-result__sub">{r.excerpt}</span>
                      )}
                    </div>
                    <span className="search-result__type">{typeLabel[r.type]}</span>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Hint when empty */}
          {!query.trim() && (
            <div className="search-hints">
              <p className="search-hints__label">Quick links</p>
              {SERVICES.map(s => (
                <button key={s.url} className="search-hint" onClick={() => handleSelect(s.url)}>
                  <i className="bi bi-arrow-right-short" />
                  {s.title}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
