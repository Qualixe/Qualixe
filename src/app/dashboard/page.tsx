'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { portfolioAPI } from '../../../lib/api/portfolio';
import { brandsAPI } from '../../../lib/api/brands';
import { clientsAPI } from '../../../lib/api/clients';
import { themesAPI } from '../../../lib/api/themes';
import { contactsAPI } from '../../../lib/api/contacts';
import { getAnalyticsOverview, getDailyTraffic, getRealTimeUsers } from '../../../lib/api/analytics';

type Row = Record<string, unknown> & { id?: string; created_at?: string; updated_at?: string };
type Traffic = { labels: string[]; pageViews: number[]; visitors: number[] };
type Overview = { pageViews?: number; uniqueVisitors?: number } | null;

const MIX_COLORS = ['#2f5bea', '#6d4dff', '#34d399', '#f59e0b'];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

function timeAgo(iso?: string) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 60) return `${Math.max(1, m)}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString();
}

const fmt = (n?: number) => (n ?? 0).toLocaleString();

export default function Dashboard() {
  const [stats, setStats] = useState({ portfolio: 0, brands: 0, clients: 0, themes: 0, contacts: 0 });
  const [overview, setOverview] = useState<Overview>(null);
  const [traffic, setTraffic] = useState<Traffic>({ labels: [], pageViews: [], visitors: [] });
  const [live, setLive] = useState(0);
  const [messages, setMessages] = useState<Row[]>([]);
  const [recentWork, setRecentWork] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const lineRef = useRef<{ destroy: () => void } | null>(null);
  const donutRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [portfolio, brands, clients, themes, contacts, analytics, daily, realTime] = await Promise.all([
          portfolioAPI.getAll().catch(() => []),
          brandsAPI.getAll().catch(() => []),
          clientsAPI.getAll().catch(() => []),
          themesAPI.getAll().catch(() => []),
          contactsAPI.getAll().catch(() => []),
          getAnalyticsOverview('7days').catch(() => null),
          getDailyTraffic('7days').catch(() => ({ labels: [], pageViews: [], visitors: [] })),
          getRealTimeUsers().catch(() => 0),
        ]);
        setStats({
          portfolio: portfolio?.length || 0,
          brands: brands?.length || 0,
          clients: clients?.length || 0,
          themes: themes?.length || 0,
          contacts: contacts?.length || 0,
        });
        setOverview(analytics as Overview);
        setTraffic(daily as Traffic);
        setLive(Number(realTime) || 0);
        setMessages(((contacts ?? []) as Row[]).slice(0, 5));
        setRecentWork(((portfolio ?? []) as Row[]).slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Charts
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    (async () => {
      const Chart = (await import('chart.js/auto')).default;
      if (cancelled) return;
      Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
      Chart.defaults.color = '#6b7280';

      const line = document.getElementById('ov-traffic') as HTMLCanvasElement | null;
      if (line && traffic.labels.length) {
        lineRef.current?.destroy();
        const ctx = line.getContext('2d')!;
        const grad = ctx.createLinearGradient(0, 0, 0, 260);
        grad.addColorStop(0, 'rgba(47, 91, 234, 0.22)');
        grad.addColorStop(1, 'rgba(47, 91, 234, 0)');
        lineRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: traffic.labels,
            datasets: [
              { label: 'Page views', data: traffic.pageViews, borderColor: '#2f5bea', backgroundColor: grad, fill: true, tension: 0.35, borderWidth: 2.5, pointRadius: 0, pointHoverRadius: 5 },
              { label: 'Visitors', data: traffic.visitors, borderColor: '#6d4dff', borderDash: [5, 5], fill: false, tension: 0.35, borderWidth: 2, pointRadius: 0, pointHoverRadius: 5 },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#eef1f7' }, border: { display: false }, ticks: { precision: 0 } },
              x: { grid: { display: false }, border: { display: false } },
            },
          },
        });
      }

      const donut = document.getElementById('ov-mix') as HTMLCanvasElement | null;
      if (donut) {
        donutRef.current?.destroy();
        donutRef.current = new Chart(donut.getContext('2d')!, {
          type: 'doughnut',
          data: {
            labels: ['Portfolio', 'Clients', 'Brands', 'Themes'],
            datasets: [{
              data: [stats.portfolio, stats.clients, stats.brands, stats.themes],
              backgroundColor: MIX_COLORS,
              borderWidth: 0,
              borderRadius: 6,
              spacing: 3,
            }],
          },
          options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } },
        });
      }
    })();
    return () => {
      cancelled = true;
      lineRef.current?.destroy();
      donutRef.current?.destroy();
      lineRef.current = null;
      donutRef.current = null;
    };
  }, [loading, traffic, stats]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const kpis = [
    { label: 'Page views (7 days)', value: fmt(overview?.pageViews), icon: 'bi-eye', tone: 'blue', href: '/dashboard/analytics' },
    { label: 'Unique visitors (7 days)', value: fmt(overview?.uniqueVisitors), icon: 'bi-people', tone: 'violet', href: '/dashboard/analytics' },
    { label: 'Visitors right now', value: fmt(live), icon: 'bi-activity', tone: 'green', href: '/dashboard/analytics', live: true },
    { label: 'Contact messages', value: fmt(stats.contacts), icon: 'bi-envelope', tone: 'amber', href: '/dashboard/contacts' },
    { label: 'Portfolio projects', value: fmt(stats.portfolio), icon: 'bi-briefcase', tone: 'blue', href: '/dashboard/portfolio' },
    { label: 'Clients', value: fmt(stats.clients), icon: 'bi-people', tone: 'cyan', href: '/dashboard/clients' },
    { label: 'Brands', value: fmt(stats.brands), icon: 'bi-award', tone: 'rose', href: '/dashboard/brands' },
    { label: 'Shopify themes', value: fmt(stats.themes), icon: 'bi-palette', tone: 'violet', href: '/dashboard/themes' },
  ];

  const mix = [
    { label: 'Portfolio', value: stats.portfolio },
    { label: 'Clients', value: stats.clients },
    { label: 'Brands', value: stats.brands },
    { label: 'Themes', value: stats.themes },
  ];

  const actions = [
    { label: 'Write a blog post', icon: 'bi-pencil-square', href: '/dashboard/blog' },
    { label: 'Add portfolio project', icon: 'bi-briefcase', href: '/dashboard/portfolio' },
    { label: 'Add Laravel project', icon: 'bi-code-square', href: '/dashboard/laravel-projects' },
    { label: 'Add HTML template', icon: 'bi-box-seam', href: '/dashboard/products' },
    { label: 'Edit home page', icon: 'bi-house', href: '/dashboard/home' },
    { label: 'Upload media', icon: 'bi-images', href: '/dashboard/media' },
  ];

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        <DashboardHeader icon="bi-grid-1x2" title="Dashboard" subtitle="overview" />

        {/* Welcome */}
        <section className="ov-hero">
          <div>
            <span className="ov-hero__date">{today}</span>
            <h2 className="ov-hero__title">{greeting()} 👋</h2>
            <p className="ov-hero__text">Here&apos;s what&apos;s happening across your website this week.</p>
          </div>
          <div className="ov-hero__actions">
            <Link href="/dashboard/blog" className="ov-hero__btn ov-hero__btn--primary"><i className="bi bi-plus-lg" aria-hidden="true" /> New post</Link>
            <Link href="/dashboard/contacts" className="ov-hero__btn"><i className="bi bi-envelope" aria-hidden="true" /> Messages</Link>
            <Link href="/" target="_blank" className="ov-hero__btn"><i className="bi bi-box-arrow-up-right" aria-hidden="true" /> View site</Link>
          </div>
        </section>

        {/* KPIs */}
        <div className="ov-kpis">
          {kpis.map((k) => (
            <Link key={k.label} href={k.href} className="ov-kpi">
              <div className="ov-kpi__top">
                <span className={`ov-kpi__icon ov-kpi__icon--${k.tone}`} aria-hidden="true"><i className={`bi ${k.icon}`} /></span>
                {k.live ? <span className="ov-kpi__tag ov-kpi__tag--live">Live</span> : <i className="bi bi-arrow-up-right ov-kpi__tag" aria-hidden="true" />}
              </div>
              <div>
                <div className="ov-kpi__value">{loading ? '—' : k.value}</div>
                <div className="ov-kpi__label">{k.label}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Charts */}
        <div className="ov-grid">
          <section className="ov-panel">
            <div className="ov-panel__head">
              <div>
                <h3 className="ov-panel__title">Website traffic</h3>
                <span className="ov-panel__sub">Last 7 days</span>
              </div>
              <Link href="/dashboard/analytics" className="ov-panel__link">Full analytics →</Link>
            </div>
            <div className="chart-container" style={{ height: 280 }}>
              {!loading && traffic.labels.length === 0 ? (
                <p className="ov-empty">No traffic recorded yet.</p>
              ) : (
                <canvas id="ov-traffic" aria-label="Page views and visitors over the last 7 days" role="img" />
              )}
            </div>
          </section>

          <section className="ov-panel">
            <div className="ov-panel__head">
              <div>
                <h3 className="ov-panel__title">Content mix</h3>
                <span className="ov-panel__sub">What&apos;s published on the site</span>
              </div>
            </div>
            <div className="chart-container" style={{ height: 180 }}>
              <canvas id="ov-mix" aria-label="Content distribution" role="img" />
            </div>
            <ul className="ov-legend list-unstyled mb-0">
              {mix.map((m, i) => (
                <li key={m.label}>
                  <span className="ov-legend__dot" style={{ background: MIX_COLORS[i] }} aria-hidden="true" />
                  {m.label}
                  <span className="ov-legend__val">{m.value}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Lists */}
        <div className="ov-grid">
          <section className="ov-panel">
            <div className="ov-panel__head">
              <div>
                <h3 className="ov-panel__title">Latest messages</h3>
                <span className="ov-panel__sub">From the contact form</span>
              </div>
              <Link href="/dashboard/contacts" className="ov-panel__link">View all →</Link>
            </div>
            {messages.length === 0 ? (
              <p className="ov-empty">{loading ? 'Loading…' : 'No messages yet.'}</p>
            ) : (
              <ul className="ov-list">
                {messages.map((m) => {
                  const name = String(m.full_name ?? 'Unknown');
                  const sub = [m.business_name, m.email].filter(Boolean).map(String).join(' · ');
                  return (
                    <li key={String(m.id)}>
                      <span className="avatar-placeholder" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>
                      <div className="ov-list__main">
                        <span className="ov-list__title">{name}</span>
                        <span className="ov-list__sub">{sub || String(m.note ?? '')}</span>
                      </div>
                      <span className="ov-list__meta">{timeAgo(m.created_at)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section className="ov-panel">
            <div className="ov-panel__head">
              <h3 className="ov-panel__title">Quick actions</h3>
            </div>
            <div className="ov-actions">
              {actions.map((a) => (
                <Link key={a.label} href={a.href} className="ov-action">
                  <i className={`bi ${a.icon}`} aria-hidden="true" /> {a.label}
                </Link>
              ))}
            </div>

            <div className="ov-panel__head mt-4">
              <h3 className="ov-panel__title">Recent portfolio</h3>
              <Link href="/dashboard/portfolio" className="ov-panel__link">Manage →</Link>
            </div>
            {recentWork.length === 0 ? (
              <p className="ov-empty">{loading ? 'Loading…' : 'No projects yet.'}</p>
            ) : (
              <ul className="ov-list">
                {recentWork.map((p) => (
                  <li key={String(p.id)}>
                    <span className="avatar-placeholder" aria-hidden="true"><i className="bi bi-briefcase" /></span>
                    <div className="ov-list__main">
                      <span className="ov-list__title">{String(p.title ?? 'Untitled')}</span>
                      <span className="ov-list__sub">{String(p.category ?? '')}</span>
                    </div>
                    <span className="ov-list__meta" style={{ textTransform: 'capitalize' }}>{String(p.status ?? '')}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="ov-foot">
          <span>Qualixe Admin</span>
          <span>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search</span>
        </footer>
      </div>
    </div>
  );
}
