'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { portfolioAPI } from '../../../lib/api/portfolio';
import { brandsAPI } from '../../../lib/api/brands';
import { clientsAPI } from '../../../lib/api/clients';
import { themesAPI } from '../../../lib/api/themes';
import { contactsAPI } from '../../../lib/api/contacts';
import {
  getAnalyticsOverview,
  getDailyTraffic,
  getRealTimeUsers,
} from '../../../lib/api/analytics';

export default function Dashboard() {
  const [stats, setStats] = useState({
    portfolio: 0,
    brands: 0,
    clients: 0,
    themes: 0,
    contacts: 0,
  });
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [dailyTraffic, setDailyTraffic] = useState<any>({ labels: [], pageViews: [], visitors: [] });
  const [realTimeUsers, setRealTimeUsers] = useState(0);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          portfolioData,
          brandsData,
          clientsData,
          themesData,
          contactsData,
          analytics,
          traffic,
          realTime,
        ] = await Promise.all([
          portfolioAPI.getAll(),
          brandsAPI.getAll(),
          clientsAPI.getAll(),
          themesAPI.getAll(),
          contactsAPI.getAll(),
          getAnalyticsOverview('7days'),
          getDailyTraffic('7days'),
          getRealTimeUsers(),
        ]);

        setStats({
          portfolio: portfolioData?.length || 0,
          brands: brandsData?.length || 0,
          clients: clientsData?.length || 0,
          themes: themesData?.length || 0,
          contacts: contactsData?.length || 0,
        });

        setAnalyticsStats(analytics);
        setDailyTraffic(traffic);
        setRealTimeUsers(realTime);

        // Get recent projects (mix of portfolio, brands, clients, themes)
        const recent = [
          ...(portfolioData?.slice(0, 2).map((p: any) => ({ ...p, type: 'Portfolio' })) || []),
          ...(brandsData?.slice(0, 1).map((b: any) => ({ ...b, type: 'Brand', client: b.name })) || []),
          ...(clientsData?.slice(0, 1).map((c: any) => ({ ...c, type: 'Client', name: c.name })) || []),
        ];

        setRecentProjects(recent);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Initialize charts after component mounts
    const initCharts = async () => {
      if (!dailyTraffic.labels.length) return;

      const Chart = (await import('chart.js/auto')).default;

      const ctxLine = document.getElementById('installChart') as HTMLCanvasElement;
      if (ctxLine) {
        const existingChart = Chart.getChart(ctxLine);
        if (existingChart) existingChart.destroy();

        new Chart(ctxLine.getContext('2d')!, {
          type: 'line',
          data: {
            labels: dailyTraffic.labels,
            datasets: [
              {
                label: 'Page Views',
                data: dailyTraffic.pageViews,
                borderColor: '#0d4be1',
                backgroundColor: 'rgba(13, 75, 225, 0.08)',
                tension: 0.2,
                pointBackgroundColor: '#0d4be1',
                pointBorderColor: '#fff',
                pointRadius: 4,
                fill: true,
                borderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#dee9f0' } },
              x: { grid: { display: false } },
            },
          },
        });
      }

      const ctxDoughnut = document.getElementById('stageChart') as HTMLCanvasElement;
      if (ctxDoughnut) {
        const existingChart = Chart.getChart(ctxDoughnut);
        if (existingChart) existingChart.destroy();

        new Chart(ctxDoughnut.getContext('2d')!, {
          type: 'doughnut',
          data: {
            labels: ['portfolio', 'brands', 'themes'],
            datasets: [
              {
                data: [stats.portfolio, stats.brands, stats.themes],
                backgroundColor: ['#0d4be1', '#0530a7', '#5a9bcf'],
                borderWidth: 0,
                borderRadius: 8,
                spacing: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: { legend: { display: false } },
          },
        });
      }
    };

    if (!loading) {
      initCharts();
    }
  }, [loading, stats.portfolio, stats.brands, stats.themes, dailyTraffic]);

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <DashboardSidebar />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-grid-fill me-2"></i>Dashboard <span>/</span> overview</h5>
          <div className="top-bar-right">
            <i className="bi bi-search text-secondary"></i>
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 p-xl-3 h-100 border-0">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-briefcase"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">portfolio items</span>
                  <h2 className="fw-bold mt-1 mb-0">{stats.portfolio}</h2>
                  <span className="text-success small"><i className="bi bi-arrow-up"></i> Active</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 p-xl-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-award"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">brands</span>
                  <h2 className="fw-bold mt-1 mb-0">{stats.brands}</h2>
                  <span className="text-info small"><i className="bi bi-star-fill"></i> featured</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 p-xl-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">active clients</span>
                  <h2 className="fw-bold mt-1 mb-0">{stats.clients}</h2>
                  <span className="text-success small"><i className="bi bi-arrow-up"></i> Total</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-xl-3">
            <div className="card p-3 p-xl-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div className="stat-icon-circle">
                  <i className="bi bi-palette"></i>
                </div>
                <div>
                  <span className="text-secondary text-uppercase small fw-semibold">themes</span>
                  <h2 className="fw-bold mt-1 mb-0">{stats.themes}</h2>
                  <span className="text-primary small"><i className="bi bi-check-circle"></i> Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Stats Row */}
        {analyticsStats && (
          <div className="row g-4 mb-4">
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 p-xl-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">page views</span>
                    <h2 className="fw-bold mt-1 mb-0">{analyticsStats.pageViews?.toLocaleString() || 0}</h2>
                    <span className="text-info small"><i className="bi bi-graph-up"></i> Last 7 days</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 p-xl-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-people"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">visitors</span>
                    <h2 className="fw-bold mt-1 mb-0">{analyticsStats.uniqueVisitors?.toLocaleString() || 0}</h2>
                    <span className="text-success small"><i className="bi bi-person-check"></i> Unique</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 p-xl-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-activity"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">active now</span>
                    <h2 className="fw-bold mt-1 mb-0">{realTimeUsers}</h2>
                    <span className="text-success small">
                      <i className="bi bi-circle-fill" style={{ fontSize: '8px' }}></i> Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-xl-3">
              <div className="card p-3 p-xl-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">messages</span>
                    <h2 className="fw-bold mt-1 mb-0">{stats.contacts}</h2>
                    <span className="text-warning small"><i className="bi bi-envelope-fill"></i> Inbox</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-lg-7">
            <div className="card p-3 p-xl-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-bar-chart-steps fs-4"></i>
                <h5 className="fw-semibold mb-0">Website traffic (last 7 days)</h5>
                {analyticsStats && analyticsStats.pageViews > 0 && (
                  <span className="badge-soft-green ms-2">
                    <i className="bi bi-arrow-up"></i> {analyticsStats.pageViews} views
                  </span>
                )}
              </div>
              <div className="chart-container">
                <canvas id="installChart" width="400" height="180"></canvas>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card p-3 p-xl-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="bi bi-pie-chart-fill fs-4"></i>
                <h5 className="fw-semibold mb-0">Project distribution</h5>
              </div>
              <div className="chart-container" style={{height: '180px'}}>
                <canvas id="stageChart" width="300" height="160"></canvas>
              </div>
              <div className="d-flex justify-content-around mt-3 small fw-medium">
                <span><span style={{color:'#0d4be1'}}>●</span> portfolio ({stats.portfolio})</span>
                <span><span style={{color:'#0530a7'}}>●</span> brands ({stats.brands})</span>
                <span><span style={{color:'#5a9bcf'}}>●</span> themes ({stats.themes})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12">
            <div className="card p-3 p-xl-4">
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-list-check fs-2 me-2"></i>
                <h5 className="fw-semibold mb-0">Recent projects</h5>
                <span className="ms-auto text-secondary"><i className="bi bi-arrow-right-circle"></i></span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr><th>project</th><th>type</th><th>client</th><th>status</th><th>updated</th></tr>
                  </thead>
                  <tbody>
                    {recentProjects.length > 0 ? (
                      recentProjects.map((project, index) => (
                        <tr key={index}>
                          <td><span className="fw-semibold">{project.name}</span></td>
                          <td>{project.type}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="avatar-placeholder me-2">
                                {project.client?.substring(0, 2).toUpperCase() || 'NA'}
                              </span>
                              {project.client || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <span className={`badge px-3 py-2 rounded-pill ${
                              project.status === 'completed' ? 'bg-success bg-opacity-25 text-success' :
                              project.status === 'in progress' ? 'bg-primary bg-opacity-25 text-primary' :
                              project.status === 'active' ? 'bg-success bg-opacity-25 text-success' :
                              'bg-warning bg-opacity-25 text-warning'
                            }`}>
                              {project.status || 'active'}
                            </span>
                          </td>
                          <td>{new Date(project.updated_at || project.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center">No recent projects</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 footer-note">
                <i className="bi bi-clock me-1"></i>updated just now · {recentProjects.length} active projects
              </div>
            </div>
          </div>
        </div>

        <footer className="d-flex justify-content-between mt-5 pt-2 text-secondary small">
          <span>⚡ Qualixe · IT Solutions & Services</span>
          <span className="d-none d-sm-block"><i className="bi bi-bootstrap-fill me-1"></i>Dashboard v1.0</span>
        </footer>
      </div>
    </div>
  );
}
