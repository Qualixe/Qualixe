'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { blogCommentsAPI, BlogComment } from '../../../../../lib/api/blog';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CommentWithPost extends BlogComment {
  blog_posts?: {
    title: string;
  };
}

export default function CommentsApprovalPage() {
  const [comments, setComments] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [selectedComment, setSelectedComment] = useState<CommentWithPost | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await blogCommentsAPI.getAll();
      setComments(data || []);
    } catch (error) {
      toast.error('Failed to load comments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await blogCommentsAPI.approve(id);
      toast.success('Comment approved successfully');
      loadComments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve comment');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await blogCommentsAPI.delete(id);
      toast.success('Comment deleted successfully');
      loadComments();
      if (selectedComment?.id === id) {
        setShowModal(false);
        setSelectedComment(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  const handleView = (comment: CommentWithPost) => {
    setSelectedComment(comment);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'pending') return !comment.approved;
    if (filter === 'approved') return comment.approved;
    return true;
  });

  const stats = {
    total: comments.length,
    pending: comments.filter(c => !c.approved).length,
    approved: comments.filter(c => c.approved).length
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-chat-dots" title="Blog Comments" subtitle="moderation" />

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-chat-dots"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">Total Comments</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle bg-warning bg-opacity-25">
                      <i className="bi bi-clock-history text-warning"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">Pending Approval</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.pending}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle bg-success bg-opacity-25">
                      <i className="bi bi-check-circle text-success"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">Approved</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.approved}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="d-flex gap-2 mb-4">
              <button
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                All ({stats.total})
              </button>
              <button
                className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setFilter('pending')}
              >
                Pending ({stats.pending})
              </button>
              <button
                className={`btn ${filter === 'approved' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilter('approved')}
              >
                Approved ({stats.approved})
              </button>
            </div>

            {/* Comments Table */}
            <div className="card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Author</th>
                      <th>Email</th>
                      <th>Post</th>
                      <th>Comment</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          No comments found
                        </td>
                      </tr>
                    ) : (
                      filteredComments.map(comment => (
                        <tr key={comment.id}>
                          <td>
                            <strong>{comment.author_name}</strong>
                          </td>
                          <td>
                            <small className="text-muted">{comment.author_email}</small>
                          </td>
                          <td>
                            {comment.blog_posts?.title ? (
                              <span className="badge bg-info">{comment.blog_posts.title}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {comment.content}
                            </div>
                          </td>
                          <td>
                            {comment.approved ? (
                              <span className="badge bg-success">Approved</span>
                            ) : (
                              <span className="badge bg-warning">Pending</span>
                            )}
                          </td>
                          <td>
                            <small>{formatDate(comment.created_at)}</small>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleView(comment)}
                                title="View"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              {!comment.approved && (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  onClick={() => handleApprove(comment.id)}
                                  title="Approve"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                              )}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(comment.id)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Comment Modal */}
      {showModal && selectedComment && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-chat-dots me-2"></i>
                    Comment Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedComment(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Author</label>
                    <p className="form-control-plaintext">{selectedComment.author_name}</p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <p className="form-control-plaintext">
                      <a href={`mailto:${selectedComment.author_email}`}>{selectedComment.author_email}</a>
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Post</label>
                    <p className="form-control-plaintext">
                      {selectedComment.blog_posts?.title || 'Unknown Post'}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Comment</label>
                    <div className="p-3 bg-light rounded">
                      {selectedComment.content}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <p className="form-control-plaintext">
                      {selectedComment.approved ? (
                        <span className="badge bg-success">Approved</span>
                      ) : (
                        <span className="badge bg-warning">Pending Approval</span>
                      )}
                    </p>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Submitted On</label>
                    <p className="form-control-plaintext">{formatDate(selectedComment.created_at)}</p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(selectedComment.id)}
                  >
                    <i className="bi bi-trash me-2"></i>Delete
                  </button>
                  {!selectedComment.approved && (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        handleApprove(selectedComment.id);
                        setShowModal(false);
                        setSelectedComment(null);
                      }}
                    >
                      <i className="bi bi-check-circle me-2"></i>Approve
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedComment(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
