'use client';

import DashboardSidebar from '@/components/DashboardSidebar';

export default function SupportPage() {
  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-ticket me-2"></i>Support <span>/</span> tickets</h5>
          <div className="top-bar-right">
            <i className="bi bi-search text-secondary"></i>
            <div className="notification-badge">
              <i className="bi bi-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style={{width: '10px', height: '10px'}}></span>
            </div>
            <div className="avatar-small">AR</div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12">
            <div className="card p-4">
              <h4 className="mb-4">Recent Support Tickets</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr><th>Ticket ID</th><th>Subject</th><th>Client</th><th>Priority</th><th>Status</th><th>Created</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="fw-semibold">#1247</span></td>
                      <td>Theme customization issue</td>
                      <td>EcoFusion Store</td>
                      <td><span className="badge bg-danger bg-opacity-25 text-danger px-3 py-2 rounded-pill">urgent</span></td>
                      <td><span className="badge bg-warning bg-opacity-25 text-warning px-3 py-2 rounded-pill">in progress</span></td>
                      <td>2 hours ago</td>
                    </tr>
                    <tr>
                      <td><span className="fw-semibold">#1246</span></td>
                      <td>Payment gateway integration</td>
                      <td>UrbanGear</td>
                      <td><span className="badge bg-warning bg-opacity-25 text-warning px-3 py-2 rounded-pill">high</span></td>
                      <td><span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-pill">open</span></td>
                      <td>5 hours ago</td>
                    </tr>
                    <tr>
                      <td><span className="fw-semibold">#1245</span></td>
                      <td>Mobile responsiveness</td>
                      <td>Minimal Home</td>
                      <td><span className="badge bg-info bg-opacity-25 text-info px-3 py-2 rounded-pill">normal</span></td>
                      <td><span className="badge bg-success bg-opacity-25 text-success px-3 py-2 rounded-pill">resolved</span></td>
                      <td>1 day ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
