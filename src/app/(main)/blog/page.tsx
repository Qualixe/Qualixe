'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogAPI, BlogPost } from '../../../../lib/api/blog';
import './blog.css';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogAPI.getAllPublished();
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const data = await blogAPI.search(searchQuery);
      setPosts(data || []);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      loadPosts();
    } else {
      blogAPI.getByCategory(category).then(data => setPosts(data || []));
    }
  };

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category).filter((cat): cat is string => Boolean(cat))))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Banner */}
      <div className="blog-banner">
        <div className="container">
          <h1>Our Blog</h1>
          <p>Insights, tutorials, and updates from the Qualixe team</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="blog-filters">
        <div className="container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </button>
          </div>

          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => filterByCategory(cat)}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="blog-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading articles...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-file-earmark-text"></i>
              <h3>No articles found</h3>
              <p>Check back soon for new content!</p>
            </div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <article key={post.id} className="blog-card">
                  {post.featured_image && (
                    <Link href={`/blog/${post.slug}`}>
                      <div className="blog-card-image">
                        <img src={post.featured_image} alt={post.title} />
                      </div>
                    </Link>
                  )}
                  <div className="blog-card-content">
                    {post.category && (
                      <span className="blog-category">{post.category}</span>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <h2>{post.title}</h2>
                    </Link>
                    <p className="blog-excerpt">{post.excerpt}</p>
                    <div className="blog-meta">
                      <div className="blog-author">
                        <i className="bi bi-person-circle"></i>
                        <span>{post.author_name || 'Qualixe Team'}</span>
                      </div>
                      <div className="blog-date">
                        <i className="bi bi-calendar"></i>
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                      </div>
                      <div className="blog-stats">
                        <span><i className="bi bi-eye"></i> {post.views}</span>
                        <span><i className="bi bi-heart"></i> {post.likes}</span>
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="read-more">
                      Read More <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
