// adminend/viewPayments.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    projectID: '',
    status: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });
  
  
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    projectID: '',
    dueamount: '',
    status: 'incomplete',
    paymentdate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPayments();
    
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // Build query params
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });
      
      const response = await axios.get(`http://localhost:5000/admin/viewpayments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setPayments(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      
      if (editingPayment) {
        // Update payment
        const response = await axios.put(
          `http://localhost:5000/admin/viewpayments/${editingPayment.paymentID}`,
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update in list
        setPayments(prev => prev.map(p => 
          p.paymentID === editingPayment.paymentID ? response.data : p
        ));
        
        setSuccess('Payment updated successfully');
      } else {
        // Create payment
        const response = await axios.post(
          'http://localhost:5000/admin/viewpayments',
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Add to list
        setPayments(prev => [response.data, ...prev]);
        setSuccess('Payment added successfully');
      }
      
      // Reset form and refresh
      resetForm();
     
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payment');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (payment) => {
    setFormData({
      projectID: payment.projectID,
      dueamount: payment.dueamount,
      status: payment.status,
      paymentdate: payment.paymentdate || new Date().toISOString().split('T')[0]
    });
    setEditingPayment(payment);
    setShowForm(true);
  };

  const handleStatusUpdate = async (paymentID, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/admin/viewpayments/${paymentID}`,
        { status: newStatus },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Update in list
      setPayments(prev => prev.map(p => 
        p.paymentID === paymentID ? { ...p, status: newStatus } : p
      ));
      
      setSuccess(`Payment status updated to ${newStatus}`);
      
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (paymentID) => {
    if (!window.confirm('Are you sure you want to delete this payment?')) {
      return;
    }
    
    try {
      setDeleting(paymentID);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/admin/viewpayments/${paymentID}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove from list
      setPayments(prev => prev.filter(p => p.paymentID !== paymentID));
      setSuccess('Payment deleted successfully');
      
      
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete payment');
    } finally {
      setDeleting(null);
    }
  };

  const resetForm = () => {
    setFormData({
      projectID: '',
      dueamount: '',
      status: 'incomplete',
      paymentdate: new Date().toISOString().split('T')[0]
    });
    setEditingPayment(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div className="view-payments">
      {/* Header */}
      <div className="page-header">
        <h1><i className="fas fa-credit-card me-2"></i>Payment Management</h1>
        <p>View and manage project payments</p>
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

      
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label><i className="fas  me-2"></i>Search</label>
            <input
              type="text"
              placeholder="Search by project ID or username"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label><i className="fas  me-2"></i>Project ID</label>
            <input
              type="text"
              placeholder="Enter Project ID"
              value={filters.projectID}
              onChange={(e) => handleFilterChange('projectID', e.target.value)}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label><i className="fas  me-2"></i>Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Statuses</option>
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label><i className="far  me-2"></i>Payment Date Range</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="date-input"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={fetchPayments} className="btn-apply">
            <i className="fas  me-2"></i>Apply Filters
          </button>
          <button onClick={() => {
            setFilters({
              projectID: '',
              status: 'all',
              startDate: '',
              endDate: '',
              search: ''
            });
          }} className="btn-clear">
            <i className="fas  me-2"></i>Clear Filters
          </button>
          <button onClick={() => setShowForm(true)} className="btn-add">
            <i className="fas  me-2"></i>Add New Payment
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <h4>
                <i className="fas  me-2"></i>
                {editingPayment ? 'Edit Payment' : 'Add New Payment'}
              </h4>
              <button onClick={resetForm} className="btn-close-form">
                <i className="fas "></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="projectID">
                    <i className="fas me-2"></i>
                    Project ID *
                  </label>
                  <input
                    type="text"
                    id="projectID"
                    name="projectID"
                    value={formData.projectID}
                    onChange={handleInputChange}
                    placeholder="Enter Project ID"
                    required
                    disabled={!!editingPayment}
                  />
                  <small className="form-help">Project must exist in the system</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="dueamount">
                    <i className="fas  me-2"></i>
                    Amount (LKR) *
                  </label>
                  <input
                    type="number"
                    id="dueamount"
                    name="dueamount"
                    value={formData.dueamount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="status">
                    <i className="fas me-2"></i>
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="incomplete">Incomplete</option>
                    <option value="complete">Complete</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="paymentdate">
                    <i className="fas  me-2"></i>
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    id="paymentdate"
                    name="paymentdate"
                    value={formData.paymentdate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      {editingPayment ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className="fas  me-2"></i>
                      {editingPayment ? 'Update Payment' : 'Create Payment'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                >
                  <i className="fas  me-2"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="payments-table-container">
        <div className="table-header">
          <h3><i className="fas  me-2"></i>Payments ({payments.length})</h3>
        </div>
        
        {payments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="fas "></i>
            </div>
            <h5>No Payments Found</h5>
            <p>No payments match your current filters. Try adjusting filters or add a new payment.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Project ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.paymentID}>
                    <td>
                      <span className="payment-id">#{payment.paymentID}</span>
                    </td>
                    <td>
                      <span className="project-id">{payment.projectID}</span>
                    </td>
                   
                    <td>
                      <div className="customer-cell">
                        <div><i className="fas  me-1"></i> {payment.username || 'Unknown'}</div>
                        
                      </div>
                    </td>
                    <td>
                      <span className="amount-badge">
                        {formatCurrency(payment.dueamount)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        <i className={`fas ${payment.status === 'complete' ? 'fa-check-circle' : 'fa-clock'} me-1`}></i>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="date-cell">
                        <i className="far fa-calendar me-1"></i>
                        {formatDate(payment.paymentdate)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(payment)}
                          className="btn-edit"
                          title="Edit Payment"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        
                        <select
                          value={payment.status}
                          onChange={(e) => handleStatusUpdate(payment.paymentID, e.target.value)}
                          className="status-select"
                          title="Change Status"
                        >
                          <option value="incomplete">Incomplete</option>
                          <option value="complete">Complete</option>
                        </select>
                        
                        <button
                          onClick={() => handleDelete(payment.paymentID)}
                          className="btn-delete"
                          disabled={deleting === payment.paymentID}
                          title="Delete Payment"
                        >
                          {deleting === payment.paymentID ? (
                            <i className="fas fa-spinner fa-spin"></i>
                          ) : (
                            <i className="fas fa-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .view-payments {
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


        .stat-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
        }

        .stat-content h3 {
          color: #ffffff;
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .stat-content p {
          color: #b8b8ff;
          margin: 0.25rem 0 0 0;
          font-size: 0.9rem;
        }

        /* Filter Section */
        .filter-section {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .filter-group {
          flex: 1;
          min-width: 250px;
        }

        .filter-group label {
          display: flex;
          align-items: center;
          color: #d1b3ff;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .search-input,
        .filter-input,
        .filter-select,
        .date-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus,
        .filter-input:focus,
        .filter-select:focus,
        .date-input:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2);
        }

        .date-range-inputs {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .date-separator {
          color: #b8b8ff;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .filter-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-apply,
        .btn-clear,
        .btn-add {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
        }

        .btn-apply {
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
        }

        .btn-apply:hover {
          background: linear-gradient(45deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        .btn-clear {
          background: linear-gradient(45deg, #95a5a6, #7f8c8d);
          color: white;
        }

        .btn-clear:hover {
          background: linear-gradient(45deg, #7f8c8d, #95a5a6);
          transform: translateY(-2px);
        }

        .btn-add {
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
          margin-left: auto;
        }

        .btn-add:hover {
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }

        /* Form Section */
        .form-section {
          margin-bottom: 2rem;
        }

        .form-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .form-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .form-header h4 {
          color: #ffffff;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .btn-close-form {
          background: transparent;
          border: none;
          color: #e74c3c;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-close-form:hover {
          background: rgba(231, 76, 60, 0.1);
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .form-group input,
        .form-group select {
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2);
        }

        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-help {
          color: #8888cc;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
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

        /* Payments Table */
        .payments-table-container {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .table-header {
          margin-bottom: 1.5rem;
        }

        .table-header h3 {
          color: #ffffff;
          font-size: 1.5rem;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .payments-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .payments-table thead {
          background: rgba(26, 26, 46, 0.8);
          border-bottom: 2px solid rgba(155, 89, 182, 0.3);
        }

        .payments-table th {
          padding: 1rem;
          text-align: left;
          color: #d1b3ff;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .payments-table td {
          padding: 1rem;
          color: #e0e0f0;
          vertical-align: middle;
          border-bottom: 1px solid rgba(155, 89, 182, 0.1);
        }

        .payments-table tbody tr:hover {
          background: rgba(155, 89, 182, 0.05);
        }

        /* Cell Styles */
        .payment-id {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .project-id {
          font-family: monospace;
          color: #d1b3ff;
          font-weight: 500;
        }

        

        .customer-cell {
          font-size: 0.9rem;
        }

        .customer-cell div {
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
        }

        .amount-badge {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .status-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }

        .status-badge.complete {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .status-badge.incomplete {
          background: rgba(155, 89, 182, 0.1);
          color: #9b59b6;
          border: 1px solid rgba(155, 89, 182, 0.3);
        }

        .date-cell {
          display: flex;
          align-items: center;
          color: #aaaaff;
          font-size: 0.95rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .btn-edit {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-edit:hover {
          background: linear-gradient(45deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .status-select {
          padding: 0.4rem 0.75rem;
          border-radius: 8px;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          color: #ffffff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .status-select:focus {
          outline: none;
          border-color: #9b59b6;
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

        /* Empty State */
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
          .view-payments {
            padding: 1rem;
          }
          
          .filter-row {
            flex-direction: column;
          }
          
          .filter-group {
            min-width: 100%;
          }
          
          .filter-actions {
            flex-direction: column;
          }
          
          .btn-add {
            margin-left: 0;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .stats-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewPayments;