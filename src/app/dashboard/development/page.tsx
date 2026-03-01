'use client';

import DashboardSidebar from '@/components/DashboardSidebar';

export default function DevelopmentPage() {
  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-code-slash me-2"></i>Development <span>/</span> projects</h5>
          <div className="top-bar-right">
            <i className="bi bi-search text-secondary"></i>
            <div className="notification-badge">
              <i className="bi bi-bell"></i>
            </div>
            <div className="avatar-small">AR</div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="card p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-code-square"></i>
                </div>
                <div>
                  <h5 className="mb-0">Active Projects</h5>
                  <p className="text-secondary mb-0 small">In development</p>
                </div>
              </div>
              <h2 className="fw-bold">12</h2>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-git"></i>
                </div>
                <div>
                  <h5 className="mb-0">Commits Today</h5>
                  <p className="text-secondary mb-0 small">Across all repos</p>
                </div>
              </div>
              <h2 className="fw-bold">47</h2>
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="card p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-bug"></i>
                </div>
                <div>
                  <h5 className="mb-0">Open Issues</h5>
                  <p className="text-secondary mb-0 small">Need attention</p>
                </div>
              </div>
              <h2 className="fw-bold">8</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
