'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { blogAPI, blogCommentsAPI, blogLikesAPI, BlogPost, BlogComment } from '../../../../../lib/api/blog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './post.css';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Comment form
  const [commentForm, setCommentForm] = useState({
    author_name: '',
    author_email: '',
    content: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      const postData = await blogAPI.getBySlug(slug);
      setPost(postData);
      setLikesCount(postData.likes || 0);

      // Load comments
      const commentsData = await blogCommentsAPI.getByPostId(postData.id);
      setComments(commentsData || []);

      // Check if user has liked
      const userIp = await getUserIp();
      const hasLiked = await blogLikesAPI.hasLiked(postData.id, userIp);
      setLiked(hasLiked);

      // Increment views (don't await)
      blogAPI.incrementViews(postData.id);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const getUserIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      return 'unknown';
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const userIp = await getUserIp();

      if (liked) {
        await blogLikesAPI.unlike(post.id, userIp);
        setLiked(false);
        setLikesCount(prev => Math.max(prev - 1, 0));
        toast.success('Like removed');
      } else {
        await blogLikesAPI.like(post.id, userIp);
        setLiked(true);
        setLikesCount(prev => prev + 1);
        toast.success('Post liked!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update like');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post) return;

    if (!commentForm.author_name || !commentForm.author_email || !commentForm.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmittingComment(true);

    try {
      await blogCommentsAPI.create({
        post_id: post.id,
        ...commentForm,
        approved: false
      });

      toast.success('Comment submitted! It will appear after approval.');
      setCommentForm({ author_name: '', author_email: '', content: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="error-container">
        <h1>Post Not Found</h1>
        <p>The blog post you're looking for doesn't exist.</p>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" />
      
      {/* SEO Meta Tags */}
      <head>
        <title>{post.meta_title || post.title} | Qualixe Blog</title>
        <meta name="description" content={post.meta_description || post.excerpt || ''} />
        <meta name="keywords" content={post.meta_keywords || post.tags?.join(', ') || ''} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:image" content={post.featured_image || ''} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ''} />
        <meta name="twitter:image" content={post.featured_image || ''} />
        <link rel="canonical" href={`https://qualixe.com/blog/${post.slug}`} />
      </head>

      {/* Article Header */}
      <article className="blog-post">
        <div className="post-header">
          <div className="container">
            <div className="breadcrumb">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>

            {post.category && (
              <span className="post-category">{post.category}</span>
            )}

            <h1>{post.title}</h1>

            <div className="post-meta">
              <div className="author-info">
                <i className="bi bi-person-circle"></i>
                <span>{post.author_name || 'Qualixe Team'}</span>
              </div>
              <div className="post-date">
                <i className="bi bi-calendar"></i>
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
              <div className="post-stats">
                <span><i className="bi bi-eye"></i> {post.views} views</span>
                <span><i className="bi bi-chat"></i> {comments.length} comments</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="post-featured-image">
            <img src={post.featured_image} alt={post.title} />
          </div>
        )}

        {/* Post Content */}
        <div className="post-content">
          <div className="container">
            <div className="content-wrapper">
              <div 
                className="post-body"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  <i className="bi bi-tags"></i>
                  {post.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              {/* Like Button */}
              <div className="post-actions">
                <button 
                  className={`like-button ${liked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  <i className={`bi bi-heart${liked ? '-fill' : ''}`}></i>
                  <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
                </button>

                <div className="share-buttons">
                  <span>Share:</span>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn twitter"
                  >
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn facebook"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="share-btn linkedin"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                <h3>Comments ({comments.length})</h3>

                {/* Comment Form */}
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <h4>Leave a Comment</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        value={commentForm.author_name}
                        onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Your Email *"
                        value={commentForm.author_email}
                        onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Your Comment *"
                      rows={5}
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn-submit" disabled={submittingComment}>
                    {submittingComment ? 'Submitting...' : 'Post Comment'}
                  </button>
                  <p className="form-note">Your comment will be reviewed before being published.</p>
                </form>

                {/* Comments List */}
                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-avatar">
                          <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <strong>{comment.author_name}</strong>
                            <span className="comment-date">{formatDate(comment.created_at)}</span>
                          </div>
                          <p>{comment.content}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Back to Blog */}
      <div className="back-to-blog">
        <div className="container">
          <Link href="/blog" className="btn-back">
            <i className="bi bi-arrow-left"></i> Back to Blog
          </Link>
        </div>
      </div>
    </>
  );
}
