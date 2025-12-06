// adminend/manageStaff.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../commonend/auth.jsx';
import axios from 'axios';

const ManageStaff = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    adminemail: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Fetch all administrators
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/managestaff', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAdmins(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch administrators');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.adminemail) {
      errors.adminemail = 'Email is required';
    } else if (!isValidEmail(formData.adminemail)) {
      errors.adminemail = 'Invalid email format';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle create administrator
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setCreating(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/admin/managestaff',
        {
          adminemail: formData.adminemail,
          password: formData.password
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Add new admin to list
      setAdmins(prev => [response.data.admin, ...prev]);
      
      // Reset form and close
      setFormData({
        adminemail: '',
        password: '',
        confirmPassword: ''
      });
      setFormErrors({});
      setShowCreateForm(false);
      setSuccess(response.data.message);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create administrator');
    } finally {
      setCreating(false);
    }
  };

  // Handle delete administrator
  const handleDeleteAdmin = async (adminID) => {
    if (!window.confirm('Are you sure you want to delete this administrator? This action cannot be undone.')) {
      return;
    }
    
    try {
      setDeleting(adminID);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/admin/managestaff/${adminID}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove admin from list
      setAdmins(prev => prev.filter(admin => admin.adminID !== adminID));
      setSuccess(response.data.message);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete administrator');
    } finally {
      setDeleting(null);
    }
  };

  // Format role display
  const formatRole = (role) => {
    return role === 'Owner' ? '👑 Owner' : '👨‍💼 Administrator';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading administrators...</p>
      </div>
    );
  }

  return (
    <div className="manage-staff">
      {/* Header */}
      <div className="page-header">
        <h1><i className="fas fa-users-cog me-2"></i>Manage Administrators</h1>
        
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="success-message">
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
          <button onClick={() => setError(null)} className="btn-dismiss">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Actions Bar */}
      <div className="actions-bar">
        <div className="actions-left">
          <h3><i className="fas fa-user-shield me-2"></i>Administrators ({admins.length})</h3>
          <p className="subtitle">Owner can manage all administrator accounts</p>
        </div>
        <div className="actions-right">
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-create"
          >
            <i className="fas fa-plus-circle me-2"></i>
            {showCreateForm ? 'Cancel' : 'Create New Administrator'}
          </button>
          <button onClick={fetchAdmins} className="btn-refresh">
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="create-form-section">
          <div className="form-card">
            <div className="form-header">
              <h4><i className="fas fa-user-plus me-2"></i>Create New Administrator</h4>
              <p>Enter email and password for the new administrator account</p>
            </div>
            
            <form onSubmit={handleCreateAdmin} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="adminemail">
                    <i className="fas fa-envelope me-2"></i>
                    Administrator Email *
                  </label>
                  <input
                    type="email"
                    id="adminemail"
                    name="adminemail"
                    value={formData.adminemail}
                    onChange={handleInputChange}
                    placeholder="admin@example.com"
                    className={`form-input ${formErrors.adminemail ? 'error' : ''}`}
                    required
                  />
                  {formErrors.adminemail && (
                    <div className="field-error">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.adminemail}
                    </div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">
                    <i className="fas fa-lock me-2"></i>
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimum 6 characters"
                    className={`form-input ${formErrors.password ? 'error' : ''}`}
                    required
                    minLength="6"
                  />
                  {formErrors.password && (
                    <div className="field-error">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.password}
                    </div>
                  )}
                  <small className="form-help">
                    <i className="fas fa-info-circle me-1"></i>
                    Password will be securely hashed before storage
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <i className="fas fa-lock me-2"></i>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                    className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <div className="field-error">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.confirmPassword}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Create Administrator
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({
                      adminemail: '',
                      password: '',
                      confirmPassword: ''
                    });
                    setFormErrors({});
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Administrators Table */}
      <div className="admins-table-container">
        <div className="table-card">
          <div className="table-header">
            <h4><i className="fas fa-list me-2"></i>Administrator Accounts</h4>
            <span className="table-info">{admins.length} account(s) found</span>
          </div>
          
          {admins.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-user-slash"></i>
              </div>
              <h5>No Administrators Found</h5>
              <p>Start by creating your first administrator account</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn-create-first"
              >
                <i className="fas fa-plus-circle me-2"></i>
                Create First Administrator
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin.adminID}>
                      <td>
                        <span className="admin-id">#{admin.adminID}</span>
                      </td>
                      <td>
                        <div className="email-cell">
                          <i className="fas fa-envelope me-2"></i>
                          {admin.adminemail}
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${admin.role.toLowerCase()}`}>
                          {formatRole(admin.role)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {admin.role !== 'Owner' && (
                            <button
                              onClick={() => handleDeleteAdmin(admin.adminID)}
                              className="btn-delete"
                              disabled={deleting === admin.adminID}
                              title="Delete Administrator"
                            >
                              {deleting === admin.adminID ? (
                                <i className="fas fa-spinner fa-spin"></i>
                              ) : (
                                <i className="fas fa-trash"></i>
                              )}
                            </button>
                          )}
                          {admin.role === 'Owner' && (
                            <span className="protected-badge" title="Protected Account">
                              <i className="fas fa-shield-alt"></i>
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .manage-staff {
          padding: 2rem;
          background: transparent;
        }

        /* Page Header */
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2.2rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #b8b8ff;
          font-size: 1.1rem;
        }

        /* Success/Error Messages */
        .success-message {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid rgba(46, 204, 113, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        .error-message {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid rgba(231, 76, 60, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-dismiss {
          background: transparent;
          border: none;
          color: #e74c3c;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .btn-dismiss:hover {
          background: rgba(231, 76, 60, 0.2);
        }

        /* Actions Bar */
        .actions-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .actions-left h3 {
          color: #ffffff;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .subtitle {
          color: #b8b8ff;
          margin: 0.25rem 0 0 0;
          font-size: 0.95rem;
        }

        .actions-right {
          display: flex;
          gap: 1rem;
        }

        .btn-create {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-create:hover {
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }

        .btn-refresh {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-refresh:hover {
          background: linear-gradient(45deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        /* Create Form */
        .create-form-section {
          margin-bottom: 2rem;
        }

        .form-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .form-header {
          margin-bottom: 1.5rem;
        }

        .form-header h4 {
          color: #ffffff;
          font-size: 1.3rem;
          margin: 0 0 0.5rem 0;
          display: flex;
          align-items: center;
        }

        .form-header p {
          color: #b8b8ff;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          color: #d1b3ff;
          font-weight: 600;
          display: flex;
          align-items: center;
        }

        .form-input {
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2);
        }

        .form-input.error {
          border-color: #e74c3c;
          background: rgba(231, 76, 60, 0.05);
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.2);
        }

        .field-error {
          color: #e74c3c;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          margin-top: 0.25rem;
        }

        .form-help {
          color: #8888cc;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-submit {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-submit:hover:not(:disabled) {
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #95a5a6, #7f8c8d);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-cancel:hover {
          background: linear-gradient(45deg, #7f8c8d, #95a5a6);
          transform: translateY(-2px);
        }

        /* Administrators Table */
        .admins-table-container {
          margin-top: 2rem;
        }

        .table-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .table-header h4 {
          color: #ffffff;
          font-size: 1.3rem;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .table-info {
          color: #b8b8ff;
          font-size: 0.9rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
        }

        .empty-icon {
          font-size: 3rem;
          color: #6c757d;
          margin-bottom: 1rem;
        }

        .empty-state h5 {
          color: #ffffff;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #b8b8ff;
          margin-bottom: 1.5rem;
        }

        .btn-create-first {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          margin: 0 auto;
        }

        .btn-create-first:hover {
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }

        /* Table */
        .table-responsive {
          overflow-x: auto;
        }

        .admins-table {
          width: 100%;
          border-collapse: collapse;
        }

        .admins-table thead {
          background: rgba(26, 26, 46, 0.8);
          border-bottom: 2px solid rgba(155, 89, 182, 0.3);
        }

        .admins-table th {
          padding: 1rem;
          text-align: left;
          color: #d1b3ff;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .admins-table tbody tr {
          border-bottom: 1px solid rgba(155, 89, 182, 0.1);
          transition: all 0.3s ease;
        }

        .admins-table tbody tr:hover {
          background: rgba(155, 89, 182, 0.05);
        }

        .admins-table td {
          padding: 1rem;
          color: #e0e0f0;
          vertical-align: middle;
        }

        .admin-id {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .email-cell {
          display: flex;
          align-items: center;
          color: #ffffff;
          font-weight: 500;
        }

        .role-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .role-badge.owner {
          background: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
          border: 1px solid rgba(241, 196, 15, 0.3);
        }

        .role-badge.administrator {
          background: rgba(155, 89, 182, 0.1);
          color: #9b59b6;
          border: 1px solid rgba(155, 89, 182, 0.3);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-delete {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-delete:hover:not(:disabled) {
          background: linear-gradient(45deg, #c0392b, #e74c3c);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }

        .btn-delete:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .protected-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border: 1px solid rgba(52, 152, 219, 0.3);
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-container .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(155, 89, 182, 0.2);
          border-top: 4px solid #9b59b6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container p {
          color: #b8b8ff;
          font-size: 1.1rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .manage-staff {
            padding: 1rem;
          }
          
          .actions-bar {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .actions-right {
            width: 100%;
            flex-direction: column;
          }
          
          .actions-right button {
            width: 100%;
            justify-content: center;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .form-actions button {
            width: 100%;
            justify-content: center;
          }
          
          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .admins-table {
            min-width: 600px;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageStaff;