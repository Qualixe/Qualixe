'use client';

import { useEffect, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import { contactsAPI, Contact } from '../../../../lib/api/contacts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="col-md-6 mb-3">
      <label className="form-label fw-semibold text-secondary small text-uppercase">{label}</label>
      <p className="mb-0">{value}</p>
    </div>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data || []);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      setStats({
        total: data?.length || 0,
        today: data?.filter((c: Contact) => new Date(c.created_at!).toDateString() === now.toDateString()).length || 0,
        thisWeek: data?.filter((c: Contact) => new Date(c.created_at!) >= weekAgo).length || 0,
      });
    } catch {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact message?')) return;
    try {
      await contactsAPI.delete(id);
      toast.success('Deleted successfully');
      fetchContacts();
      if (selectedContact?.id === id) { setShowModal(false); setSelectedContact(null); }
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />
      <div className="main-content">
        <DashboardHeader icon="bi-envelope" title="Contact Messages" />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="row g-4 mb-4">
              {[
                { icon: 'bi-envelope-fill', label: 'Total Messages', value: stats.total },
                { icon: 'bi-calendar-day', label: 'Today', value: stats.today },
                { icon: 'bi-calendar-week', label: 'This Week', value: stats.thisWeek },
              ].map(({ icon, label, value }) => (
                <div className="col-md-4" key={label}>
                  <div className="card p-3 h-100">
                    <div className="d-flex align-items-center gap-3">
                      <div className="stat-icon-circle"><i className={`bi ${icon}`}></i></div>
                      <div>
                        <span className="text-secondary text-uppercase small fw-semibold">{label}</span>
                        <h2 className="fw-bold mt-1 mb-0">{value}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="card p-4">
              <h4 className="mb-4">All Messages</h4>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Business</th>
                      <th>Budget</th>
                      <th>Country</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.length > 0 ? contacts.map((c) => (
                      <tr key={c.id}>
                        <td><span className="fw-semibold">{c.full_name}</span></td>
                        <td>{c.email}</td>
                        <td>{c.phone || '—'}</td>
                        <td>{c.business_name || c.company_name || '—'}</td>
                        <td>{c.budget || '—'}</td>
                        <td>{c.country}</td>
                        <td>{new Date(c.created_at!).toLocaleDateString()}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setSelectedContact(c); setShowModal(true); }} title="View">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(c.id!)} title="Delete">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={8} className="text-center">No contact messages found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && selectedContact && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-envelope-open me-2"></i>Contact Details</h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); setSelectedContact(null); }}></button>
              </div>
              <div className="modal-body">

                <p className="text-uppercase small fw-semibold text-secondary mb-2" style={{ borderBottom: '1px solid #e5ebff', paddingBottom: 6 }}>Personal Info</p>
                <div className="row">
                  <DetailRow label="Full Name" value={selectedContact.full_name} />
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold text-secondary small text-uppercase">Email</label>
                    <p className="mb-0"><a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a></p>
                  </div>
                  <DetailRow label="Phone" value={selectedContact.phone} />
                  <DetailRow label="Address" value={selectedContact.address} />
                  <DetailRow label="Country" value={selectedContact.country} />
                </div>

                <p className="text-uppercase small fw-semibold text-secondary mb-2 mt-2" style={{ borderBottom: '1px solid #e5ebff', paddingBottom: 6 }}>Business Info</p>
                <div className="row">
                  <DetailRow label="Business Name" value={selectedContact.business_name || selectedContact.company_name} />
                  <DetailRow label="Business Type" value={selectedContact.business_type} />
                  <DetailRow label="Theme" value={selectedContact.theme} />
                  <DetailRow label="Budget" value={selectedContact.budget} />
                  <DetailRow label="Preferred Meeting Time" value={selectedContact.meeting_time} />
                </div>

                {selectedContact.note && (
                  <>
                    <p className="text-uppercase small fw-semibold text-secondary mb-2 mt-2" style={{ borderBottom: '1px solid #e5ebff', paddingBottom: 6 }}>Notes</p>
                    <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: 4, minHeight: 80 }}>
                      {selectedContact.note}
                    </div>
                  </>
                )}

                <p className="text-secondary small mt-3 mb-0">
                  Received: {new Date(selectedContact.created_at!).toLocaleString()}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={() => handleDelete(selectedContact.id!)}>
                  <i className="bi bi-trash me-2"></i>Delete
                </button>
                <button className="btn btn-secondary" onClick={() => { setShowModal(false); setSelectedContact(null); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
