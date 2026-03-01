'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import {
  getAnalyticsOverview,
  getTopPages,
  getTrafficSources,
  getDeviceBreakdown,
  getCountryData,
  getRealTimeUsers,
  getDailyTraffic,
} from '../../../../lib/api/analytics';

interface Stats {
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  avgPageViewsPerSession: string | number;
}

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [realTimeUsers, setRealTimeUsers] = useState(0);
  const [dailyTraffic, setDailyTraffic] = useState<any>({ labels: [], pageViews: [], visitors: [] });

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overview, pages, sources, devicesData, countriesData, realTime, traffic] = await Promise.all([
          getAnalyticsOverview(dateRange),
          getTopPages(dateRange, 10),
          getTrafficSources(dateRange),
          getDeviceBreakdown(dateRange),
          getCountryData(dateRange, 10),
          getRealTimeUsers(),
          getDailyTraffic(dateRange),
        ]);

        setStats(overview);
        setTopPages(pages);
        setTrafficSources(sources);
        setDevices(devicesData);
        setCountries(countriesData);
        setRealTimeUsers(realTime);
        setDailyTraffic(traffic);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  useEffect(() => {
    // Initialize charts
    const initCharts = async () => {
      if (!dailyTraffic.labels.length) return;

      const Chart = (await import('chart.js/auto')).default;

      // Traffic Chart
      const trafficCtx = document.getElementById('trafficChart') as HTMLCanvasElement;
      if (trafficCtx) {
        const existingChart = Chart.getChart(trafficCtx);
        if (existingChart) existingChart.destroy();

        new Chart(trafficCtx.getContext('2d')!, {
          type: 'line',
          data: {
            labels: dailyTraffic.labels,
            datasets: [
              {
                label: 'Page Views',
                data: dailyTraffic.pageViews,
                borderColor: '#0d4be1',
                backgroundColor: 'rgba(13, 75, 225, 0.1)',
                tension: 0.4,
                fill: true,
              },
              {
                label: 'Visitors',
                data: dailyTraffic.visitors,
                borderColor: '#0530a7',
                backgroundColor: 'rgba(5, 48, 167, 0.1)',
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }

      // Traffic Sources Chart
      const sourcesCtx = document.getElementById('sourcesChart') as HTMLCanvasElement;
      if (sourcesCtx && trafficSources.length) {
        const existingChart = Chart.getChart(sourcesCtx);
        if (existingChart) existingChart.destroy();

        new Chart(sourcesCtx.getContext('2d')!, {
          type: 'doughnut',
          data: {
            labels: trafficSources.map((s) => s.source),
            datasets: [
              {
                data: trafficSources.map((s) => s.visitors),
                backgroundColor: ['#0d4be1', '#0530a7', '#5a9bcf', '#89b5e0'],
                borderWidth: 0,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
            },
          },
        });
      }

      // Devices Chart
      const devicesCtx = document.getElementById('devicesChart') as HTMLCanvasElement;
      if (devicesCtx && devices.length) {
        const existingChart = Chart.getChart(devicesCtx);
        if (existingChart) existingChart.destroy();

        new Chart(devicesCtx.getContext('2d')!, {
          type: 'bar',
          data: {
            labels: devices.map((d) => d.device),
            datasets: [
              {
                label: 'Users',
                data: devices.map((d) => d.users),
                backgroundColor: ['#0d4be1', '#0530a7', '#5a9bcf'],
                borderRadius: 8,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      }
    };

    initCharts();
  }, [dailyTraffic, trafficSources, devices]);

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title">
            <i className="bi bi-graph-up me-2"></i>Analytics <span>/</span> insights
          </h5>
          <div className="top-bar-right">
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto', marginRight: '15px' }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
            </select>
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-sm-6 col-xl-3">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-eye"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">page views</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats?.pageViews.toLocaleString() || 0}</h2>
                      <span className="small text-muted">Total views</span>
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
                      <h2 className="fw-bold mt-1 mb-0">{stats?.uniqueVisitors.toLocaleString() || 0}</h2>
                      <span className="small text-muted">Unique visitors</span>
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
                      <span className="text-secondary text-uppercase small fw-semibold">sessions</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats?.sessions.toLocaleString() || 0}</h2>
                      <span className="small text-muted">Total sessions</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 col-xl-3">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-graph-up"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">avg. pages</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats?.avgPageViewsPerSession || 0}</h2>
                      <span className="small text-muted">Per session</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Charts Row */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card p-4">
              <h5 className="mb-3">
                <i className="bi bi-graph-up me-2"></i>Traffic Overview
              </h5>
              <div style={{ height: '300px' }}>
                <canvas id="trafficChart"></canvas>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card p-4">
              <h5 className="mb-3">
                <i className="bi bi-pie-chart me-2"></i>Traffic Sources
              </h5>
              <div style={{ height: '300px' }}>
                <canvas id="sourcesChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        {/* Data Tables Row */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card p-4">
              <h5 className="mb-3">
                <i className="bi bi-file-earmark-text me-2"></i>Top Pages
              </h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Views</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.length > 0 ? (
                      topPages.map((page, index) => {
                        const totalViews = stats?.pageViews || 1;
                        const percentage = Math.round((page.views / totalViews) * 100);
                        return (
                          <tr key={index}>
                            <td>
                              <code>{page.page}</code>
                            </td>
                            <td>{page.views.toLocaleString()}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress" style={{ width: '60px', height: '6px' }}>
                                  <div
                                    className="progress-bar bg-primary"
                                    style={{ width: `${Math.min(percentage * 4, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="small">{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card p-4">
              <h5 className="mb-3">
                <i className="bi bi-globe me-2"></i>Top Countries
              </h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Country</th>
                      <th>Users</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.length > 0 ? (
                      countries.map((country, index) => {
                        const totalUsers = stats?.uniqueVisitors || 1;
                        const percentage = Math.round((country.users / totalUsers) * 100);
                        const countryFlags: { [key: string]: string } = {
                          'United States': '🇺🇸',
                          'United Kingdom': '🇬🇧',
                          Canada: '🇨🇦',
                          Australia: '🇦🇺',
                          Germany: '🇩🇪',
                          France: '🇫🇷',
                          India: '🇮🇳',
                          Japan: '🇯🇵',
                          China: '🇨🇳',
                          Brazil: '🇧🇷',
                          Unknown: '🌍',
                        };
                        return (
                          <tr key={index}>
                            <td>
                              <span className="me-2">{countryFlags[country.country] || '🌍'}</span>
                              {country.country}
                            </td>
                            <td>{country.users.toLocaleString()}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div className="progress" style={{ width: '60px', height: '6px' }}>
                                  <div
                                    className="progress-bar bg-success"
                                    style={{ width: `${Math.min(percentage * 2.5, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="small">{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center text-muted">
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Devices and Real-time */}
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card p-4">
              <h5 className="mb-3">
                <i className="bi bi-phone me-2"></i>Devices
              </h5>
              <div style={{ height: '250px' }}>
                <canvas id="devicesChart"></canvas>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card p-4">
              <h5 className="mb-3">
                <i className="bi bi-activity me-2"></i>Real-time Activity
              </h5>
              <div className="d-flex align-items-center justify-content-center" style={{ height: '250px' }}>
                <div className="text-center">
                  <h1 className="display-3 fw-bold text-primary mb-2">{realTimeUsers}</h1>
                  <p className="text-secondary mb-0">Active users right now</p>
                  <div className="mt-3">
                    <span className="badge bg-success me-2">
                      <i className="bi bi-circle-fill" style={{ fontSize: '8px' }}></i> Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Alert */}
        <div className="alert alert-info mt-4" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Supabase Analytics:</strong> This dashboard shows real-time analytics data tracked by your own Supabase database. 
          All visitor data is stored securely and you have full control over it.
        </div>
          </>
        )}
      </div>
    </div>
  );
}
