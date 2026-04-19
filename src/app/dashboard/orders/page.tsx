'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { createClient } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

// Orders are admin-only — use service role so RLS doesn't block reads
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Order {
  id: string;
  payment_id: string;
  customer_email: string;
  customer_name: string;
  product_id: string;
  product_name: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  download_tokens?: { download_count: number; download_limit: number; expires_at: string }[];
}

type FilterStatus = 'all' | 'COMPLETED' | 'PENDING' | 'FAILED';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    let result = [...orders];
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        o.customer_email.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.payment_id.toLowerCase().includes(q) ||
        o.product_name.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [orders, search, statusFilter]);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*, download_tokens(download_count, download_limit, expires_at)')
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load orders');
    else setOrders(data ?? []);
    setLoading(false);
  }

  const totalRevenue = orders.reduce((s, o) => s + Number(o.amount), 0);
  const completedCount = orders.filter(o => o.status === 'COMPLETED').length;
  const freeCount = orders.filter(o => Number(o.amount) === 0).length;
  const paidOrders = orders.filter(o => Number(o.amount) > 0);

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      COMPLETED: 'success',
      PENDING: 'warning',
      FAILED: 'danger',
    };
    return (
      <span className={`badge bg-${map[status] ?? 'secondary'} rounded-pill`}>
        {status}
      </span>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <DashboardSidebar />

      <div className="main-content">
        {/* Top bar */}
        <div className="top-bar">
          <h5 className="page-title">
            <i className="bi bi-receipt me-2"></i>Orders <span>/</span> Sales
          </h5>
          <div className="top-bar-right">
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-4">
          {[
            { icon: 'bi-receipt', label: 'Total Orders', value: orders.length },
            { icon: 'bi-check-circle', label: 'Completed', value: completedCount },
            { icon: 'bi-currency-dollar', label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}` },
            { icon: 'bi-graph-up-arrow', label: 'Avg. Order', value: orders.length ? `$${(totalRevenue / orders.length).toFixed(2)}` : '$0.00' },
          ].map((s) => (
            <div key={s.label} className="col-sm-6 col-xl-3">
              <div className="card p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className="stat-icon-circle"><i className={`bi ${s.icon}`}></i></div>
                  <div>
                    <span className="text-secondary text-uppercase small fw-semibold">{s.label}</span>
                    <h2 className="fw-bold mt-1 mb-0">{s.value}</h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card p-3 mb-4">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, payment ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
              >
                <option value="all">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
            <div className="col-md-4 text-end">
              <span className="text-muted small">{filtered.length} order{filtered.length !== 1 ? 's' : ''} found</span>
              <button className="btn btn-sm btn-outline-primary ms-3" onClick={fetchOrders}>
                <i className="bi bi-arrow-clockwise me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card p-4">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-receipt display-1 d-block mb-3"></i>
              <p>{orders.length === 0 ? 'No orders yet' : 'No orders match your search'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Downloads</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => {
                    const token = order.download_tokens?.[0];
                    return (
                      <tr key={order.id}>
                        <td>
                          <div className="fw-semibold" style={{ fontSize: 14 }}>{order.customer_name}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>{order.customer_email}</div>
                        </td>
                        <td style={{ fontSize: 14 }}>{order.product_name}</td>
        <td className="fw-bold">
                          {Number(order.amount) === 0
                            ? <span className="badge bg-success rounded-pill">Free</span>
                            : `$${Number(order.amount).toFixed(2)}`}
                        </td>
                        <td>{statusBadge(order.status)}</td>
                        <td>
                          {token ? (
                            <span style={{ fontSize: 13 }}>
                              <i className="bi bi-download me-1 text-primary"></i>
                              {token.download_count}/{token.download_limit}
                            </span>
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>
                        <td className="text-muted small">{formatDate(order.created_at)}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setSelected(order)}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <>
          <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />
          <div className="modal fade show d-block" tabIndex={-1} style={{ zIndex: 1050 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ borderRadius: 20 }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    <i className="bi bi-receipt me-2 text-primary"></i>Order Detail
                  </h5>
                  <button className="btn-close" onClick={() => setSelected(null)} />
                </div>
                <div className="modal-body pt-0">
                  {[
                    ['Payment ID', selected.payment_id],
                    ['Customer', selected.customer_name],
                    ['Email', selected.customer_email],
                    ['Product', selected.product_name],
                    ['Amount', `$${Number(selected.amount).toFixed(2)} ${selected.currency}`],
                    ['Status', selected.status],
                    ['Date', formatDate(selected.created_at)],
                  ].map(([label, value]) => (
                    <div key={label} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
                      <span className="text-muted">{label}</span>
                      <span className="fw-semibold text-end" style={{ maxWidth: '60%', wordBreak: 'break-all' }}>{value}</span>
                    </div>
                  ))}

                  {selected.download_tokens?.[0] && (
                    <>
                      <div className="mt-3 mb-1 fw-semibold small text-uppercase text-muted">Download Token</div>
                      {[
                        ['Downloads Used', `${selected.download_tokens[0].download_count} / ${selected.download_tokens[0].download_limit}`],
                        ['Expires', formatDate(selected.download_tokens[0].expires_at)],
                      ].map(([label, value]) => (
                        <div key={label} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
                          <span className="text-muted">{label}</span>
                          <span className="fw-semibold">{value}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="modal-footer border-0">
                  <button className="btn btn-light" onClick={() => setSelected(null)}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
