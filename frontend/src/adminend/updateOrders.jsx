// adminend/updateOrders.jsx
import { useState } from 'react';
import { useAuth } from '../commonend/auth.jsx';
import axios from 'axios';

const UpdateOrders = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    cost: '',
    est_deadline: ''
  });

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a username or project ID');
      return;
    }
    
    try {
      setSearching(true);
      setError(null);
      setSuccess(null);
      setSelectedOrder(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/admin/updateorders/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSearchResults(response.data);
      
      if (response.data.length === 1) {
        // If only one result, select it automatically
        handleSelectOrder(response.data[0]);
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search for orders');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Handle order selection
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setFormData({
      cost: order.cost || '',
      est_deadline: order.est_deadline ? order.est_deadline.split('T')[0] : ''
    });
    setError(null);
    setSuccess(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedOrder) {
      setError('Please select an order first');
      return;
    }
    
    // Validate that at least one field is being updated
    if (!formData.cost && !formData.est_deadline) {
      setError('Please enter at least one field to update (cost or estimated deadline)');
      return;
    }
    
    // Prepare update data
    const updateData = {};
    if (formData.cost) updateData.cost = parseFloat(formData.cost);
    if (formData.est_deadline) updateData.est_deadline = formData.est_deadline;
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/admin/updateorders/${selectedOrder.projectID}`,
        updateData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess('Order updated successfully!');
      
      // Update the selected order with new data
      setSelectedOrder(prev => ({
        ...prev,
        ...updateData
      }));
      
      // Clear form
      setFormData({
        cost: '',
        est_deadline: ''
      });
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not Set';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="update-orders">
      {/* Header */}
      <div className="page-header">
        <h1><i className="fas fa-edit me-2"></i>Update Orders</h1>
       
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-card">
          <h3><i className="fas fa-search me-2"></i>Search Orders</h3>
          <p>Enter a username or project ID to find orders</p>
          
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username or project ID..."
                className="search-input"
                required
              />
              <button type="submit" className="btn-search" disabled={searching}>
                {searching ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2"></i>
                    Searching...
                  </>
                ) : (
                  <>
                    <i className="fas fa-search me-2"></i>
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              <h4><i className="fas fa-list me-2"></i>Search Results ({searchResults.length})</h4>
              <div className="results-grid">
                {searchResults.map((order) => (
                  <div 
                    key={order.projectID}
                    className={`result-card ${selectedOrder?.projectID === order.projectID ? 'selected' : ''}`}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <div className="result-header">
                      <span className="project-id">#{order.projectID}</span>
                      <span className={`status-badge ${order.project_status?.toLowerCase()}`}>
                        {order.project_status || 'Unknown'}
                      </span>
                    </div>
                    <div className="result-body">
                      <p><strong>Username:</strong> {order.username || 'N/A'}</p>
                      <p><strong>Order Date:</strong> {formatDate(order.order_date)}</p>
                      <p><strong>Cost:</strong> {order.cost ? `LKR ${order.cost}` : 'Not Set'}</p>
                    </div>
                    <div className="result-footer">
                      <button 
                        className="btn-select"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOrder(order);
                        }}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Select to Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Details & Edit Form */}
      {selectedOrder && (
        <div className="edit-section">
          <div className="edit-card">
            <div className="card-header">
              <h3>
                <i className="fas fa-file-alt me-2"></i>
                Editing Order #{selectedOrder.projectID}
              </h3>
              <span className="edit-status">Selected for Editing</span>
            </div>

            <div className="card-content">
              {/* Current Details */}
              <div className="current-details">
                <h4><i className="fas fa-info-circle me-2"></i>Current Details</h4>
                <div className="details-grid">
                  <div className="detail-item">
                    <label>Project ID:</label>
                    <span className="detail-value">#{selectedOrder.projectID}</span>
                  </div>
                  <div className="detail-item">
                    <label>Username:</label>
                    <span className="detail-value">{selectedOrder.username || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Order Date:</label>
                    <span className="detail-value">{formatDate(selectedOrder.order_date)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Current Cost:</label>
                    <span className={`detail-value ${selectedOrder.cost ? 'has-value' : 'no-value'}`}>
                      {selectedOrder.cost ? `LKR ${selectedOrder.cost}` : 'Not Set'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Current Est. Deadline:</label>
                    <span className={`detail-value ${selectedOrder.est_deadline ? 'has-value' : 'no-value'}`}>
                      {formatDate(selectedOrder.est_deadline)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Required Deadline:</label>
                    <span className="detail-value">{formatDate(selectedOrder.required_deadline)}</span>
                  </div>
                  <div className="detail-item">
                    <label>Project Status:</label>
                    <span className={`status-badge ${selectedOrder.project_status?.toLowerCase()}`}>
                      {selectedOrder.project_status || 'Unknown'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Payment Status:</label>
                    <span className={`payment-badge ${selectedOrder.payment_status?.toLowerCase()}`}>
                      {selectedOrder.payment_status || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                {selectedOrder.description && (
                  <div className="description-section">
                    <h5><i className="fas fa-align-left me-2"></i>Project Description</h5>
                    <p className="description-text">{selectedOrder.description}</p>
                  </div>
                )}
              </div>

              {/* Edit Form */}
              <div className="edit-form-section">
                <h4><i className="fas fa-edit me-2"></i>Update Order</h4>
                <p className="form-subtitle">Enter new values for the fields you want to update</p>
                
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
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="cost">
                        <i className="fas fa-money-bill-wave me-2"></i>
                        New Cost (LKR)
                      </label>
                      <input
                        type="number"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleInputChange}
                        placeholder="Enter new cost"
                        min="0"
                        step="0.01"
                        className="form-input"
                      />
                      <small className="form-help">
                        Leave empty to keep current value: {selectedOrder.cost ? `LKR ${selectedOrder.cost}` : 'Not Set'}
                      </small>
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="est_deadline">
                        <i className="far fa-calendar me-2"></i>
                        New Estimated Deadline
                      </label>
                      <input
                        type="date"
                        id="est_deadline"
                        name="est_deadline"
                        value={formData.est_deadline}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                      <small className="form-help">
                        Leave empty to keep current value: {formatDate(selectedOrder.est_deadline)}
                      </small>
                    </div>
                  </div>
                  
                  <div className="form-actions">
                    <button
                      type="submit"
                      className="btn-update"
                      disabled={loading || (!formData.cost && !formData.est_deadline)}
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Update Order
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      className="btn-clear"
                      onClick={() => {
                        setFormData({
                          cost: '',
                          est_deadline: ''
                        });
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      <i className="fas fa-eraser me-2"></i>
                      Clear Form
                    </button>
                    
                    <button
                      type="button"
                      className="btn-deselect"
                      onClick={() => {
                        setSelectedOrder(null);
                        setFormData({
                          cost: '',
                          est_deadline: ''
                        });
                        setError(null);
                        setSuccess(null);
                      }}
                    >
                      <i className="fas fa-times me-2"></i>
                      Deselect Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .update-orders {
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

        /* Search Section */
        .search-section {
          margin-bottom: 2rem;
        }

        .search-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .search-card h3 {
          color: #ffffff;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .search-card p {
          color: #b8b8ff;
          margin-bottom: 1.5rem;
        }

        .search-form {
          margin-bottom: 1.5rem;
        }

        .search-input-group {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2);
        }

        .btn-search {
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

        .btn-search:hover:not(:disabled) {
          background: linear-gradient(45deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        .btn-search:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Search Results */
        .search-results h4 {
          color: #ffffff;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }

        .result-card {
          background: rgba(26, 26, 46, 0.8);
          border-radius: 10px;
          padding: 1.25rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .result-card:hover {
          background: rgba(155, 89, 182, 0.1);
          border-color: #9b59b6;
          transform: translateY(-2px);
        }

        .result-card.selected {
          background: rgba(52, 152, 219, 0.1);
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .project-id {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .status-badge.complete {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .status-badge.ongoing {
          background: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
          border: 1px solid rgba(241, 196, 15, 0.3);
        }

        .status-badge.pending {
          background: rgba(155, 89, 182, 0.1);
          color: #9b59b6;
          border: 1px solid rgba(155, 89, 182, 0.3);
        }

        .result-body p {
          margin: 0.5rem 0;
          color: #e0e0f0;
          font-size: 0.95rem;
        }

        .result-body strong {
          color: #d1b3ff;
          margin-right: 0.5rem;
        }

        .result-footer {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        .btn-select {
          padding: 0.5rem 1rem;
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-select:hover {
          background: linear-gradient(45deg, #8e44ad, #9b59b6);
          transform: translateY(-2px);
        }

        /* Edit Section */
        .edit-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          border: 1px solid rgba(155, 89, 182, 0.2);
          overflow: hidden;
        }

        .card-header {
          background: rgba(26, 26, 46, 0.8);
          padding: 1.5rem;
          border-bottom: 1px solid rgba(155, 89, 182, 0.3);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-header h3 {
          color: #ffffff;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .edit-status {
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .card-content {
          padding: 1.5rem;
        }

        .current-details {
          margin-bottom: 2rem;
        }

        .current-details h4 {
          color: #ffffff;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item label {
          color: #b8b8ff;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .detail-value {
          color: #ffffff;
          font-size: 1rem;
          padding: 0.5rem;
          background: rgba(26, 26, 46, 0.5);
          border-radius: 8px;
          border: 1px solid rgba(155, 89, 182, 0.1);
        }

        .detail-value.has-value {
          color: #2ecc71;
          font-weight: 600;
        }

        .detail-value.no-value {
          color: #e74c3c;
          font-style: italic;
        }

        .description-section {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(26, 26, 46, 0.5);
          border-radius: 10px;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .description-section h5 {
          color: #d1b3ff;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
        }

        .description-text {
          color: #ffffff;
          line-height: 1.6;
          margin: 0;
        }

        /* Edit Form */
        .edit-form-section {
          padding: 1.5rem;
          background: rgba(26, 26, 46, 0.5);
          border-radius: 10px;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .edit-form-section h4 {
          color: #ffffff;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .form-subtitle {
          color: #b8b8ff;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .success-message {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(46, 204, 113, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
        }

        .error-message {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid rgba(231, 76, 60, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
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

        .form-help {
          color: #8888cc;
          font-size: 0.85rem;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-update {
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

        .btn-update:hover:not(:disabled) {
          background: linear-gradient(45deg, #27ae60, #2ecc71);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }

        .btn-update:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-clear {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #f39c12, #e67e22);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-clear:hover {
          background: linear-gradient(45deg, #e67e22, #f39c12);
          transform: translateY(-2px);
        }

        .btn-deselect {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }

        .btn-deselect:hover {
          background: linear-gradient(45deg, #c0392b, #e74c3c);
          transform: translateY(-2px);
        }

        /* Payment Badge */
        .payment-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .payment-badge.complete {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .payment-badge.incomplete {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .update-orders {
            padding: 1rem;
          }
          
          .search-input-group {
            flex-direction: column;
          }
          
          .results-grid {
            grid-template-columns: 1fr;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
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
        }
      `}</style>
    </div>
  );
};

export default UpdateOrders;