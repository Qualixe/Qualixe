'use client';

import { useEffect, useState, useRef } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';
import NotificationDropdown from '@/components/NotificationDropdown';
import UserAvatar from '@/components/UserAvatar';
import { contactsAPI, Contact } from '../../../../lib/api/contacts';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await contactsAPI.getAll();
      setContacts(data || []);
      
      // Calculate stats
      const now = new Date();
      const today = data?.filter((c: Contact) => {
        const createdDate = new Date(c.created_at!);
        return createdDate.toDateString() === now.toDateString();
      }).length || 0;

      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thisWeek = data?.filter((c: Contact) => {
        const createdDate = new Date(c.created_at!);
        return createdDate >= weekAgo;
      }).length || 0;
      
      setStats({
        total: data?.length || 0,
        today,
        thisWeek,
      });
    } catch (error: any) {
      toast.error('Failed to load contacts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (contact: Contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) return;

    try {
      await contactsAPI.delete(id);
      toast.success('Contact message deleted successfully');
      fetchContacts();
      if (selectedContact?.id === id) {
        setShowModal(false);
        setSelectedContact(null);
      }
    } catch (error: any) {
      toast.error('Failed to delete contact message');
      console.error(error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  return (
    <div className="dashboard-wrapper">
      <ToastContainer position="top-right" />
      <DashboardSidebar />

      <div className="main-content">
        <div className="top-bar">
          <h5 className="page-title"><i className="bi bi-envelope me-2"></i>Contact Messages</h5>
          <div className="top-bar-right">
            <i className="bi bi-search text-secondary"></i>
            <NotificationDropdown />
            <UserAvatar />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : (
          <>
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">total messages</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.total}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-calendar-day"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">today</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.today}</h2>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card p-3 h-100">
                  <div className="d-flex align-items-center gap-3">
                    <div className="stat-icon-circle">
                      <i className="bi bi-calendar-week"></i>
                    </div>
                    <div>
                      <span className="text-secondary text-uppercase small fw-semibold">this week</span>
                      <h2 className="fw-bold mt-1 mb-0">{stats.thisWeek}</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12">
                <div className="card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">All Messages</h4>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover align-middle">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Company</th>
                          <th>Country</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.length > 0 ? (
                          contacts.map((contact) => (
                            <tr key={contact.id}>
                              <td><span className="fw-semibold">{contact.full_name}</span></td>
                              <td>{contact.email}</td>
                              <td>{contact.phone || 'N/A'}</td>
                              <td>{contact.company_name || 'N/A'}</td>
                              <td>{contact.country}</td>
                              <td>{new Date(contact.created_at!).toLocaleDateString()}</td>
                              <td>
                                <button 
                                  className="btn btn-sm btn-outline-primary me-2"
                                  onClick={() => handleView(contact)}
                                  title="View Details"
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(contact.id!)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="text-center">No contact messages found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      {showModal && selectedContact && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-open me-2"></i>
                  Contact Message Details
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Full Name</label>
                    <p className="form-control-plaintext">{selectedContact.full_name}</p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Email</label>
                    <p className="form-control-plaintext">
                      <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                    </p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Phone</label>
                    <p className="form-control-plaintext">
                      {selectedContact.phone ? (
                        <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                      ) : 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Company</label>
                    <p className="form-control-plaintext">{selectedContact.company_name || 'N/A'}</p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Country</label>
                    <p className="form-control-plaintext">{selectedContact.country}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">State</label>
                    <p className="form-control-plaintext">{selectedContact.state}</p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold">Zip Code</label>
                    <p className="form-control-plaintext">{selectedContact.zip_code}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <div className="p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', minHeight: '100px' }}>
                    {selectedContact.note || 'No message provided'}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Received On</label>
                  <p className="form-control-plaintext">
                    {new Date(selectedContact.created_at!).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedContact.id!)}
                >
                  <i className="bi bi-trash me-2"></i>Delete Message
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
