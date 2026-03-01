'use client';

import DashboardSidebar from '@/components/DashboardSidebar';

export default function AnalyticsPage() {
  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-graph-up me-2"></i>Analytics <span>/</span> insights</h5>
          <div className="top-bar-right">
            <i className="bi bi-search text-secondary"></i>
            <div className="notification-badge">
              <i className="bi bi-bell"></i>
            </div>
            <div className="avatar-small">AR</div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-eye"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">page views</span>
                  <h2 className="fw-bold mt-1 mb-0">24.5K</h2>
                  <span className="text-success small"><i className="bi bi-arrow-up"></i> +12%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">visitors</span>
                  <h2 className="fw-bold mt-1 mb-0">8.2K</h2>
                  <span className="text-success small"><i className="bi bi-arrow-up"></i> +8%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-clock"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">avg. time</span>
                  <h2 className="fw-bold mt-1 mb-0">3m 24s</h2>
                  <span className="text-info small"><i className="bi bi-dash"></i> stable</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-cart"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">conversions</span>
                  <h2 className="fw-bold mt-1 mb-0">342</h2>
                  <span className="text-success small"><i className="bi bi-arrow-up"></i> +15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
