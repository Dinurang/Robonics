import { useState, useEffect } from 'react';
import { useAuth } from '../commonend/auth.jsx';

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // State for editing description
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/user/orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (order) => {
    setEditingOrderId(order.projectID);
    setEditDescription('');
  };

  const cancelEditing = () => {
    setEditingOrderId(null);
    setEditDescription('');
  };

  const handleUpdateDescription = async (orderId) => {
    if (!editDescription.trim()) {
      setError('Please enter some text for the update');
      return;
    }

    setIsUpdating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/user/orders/${orderId}/description`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newDescriptionText: editDescription.trim() })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Description updated successfully!');
        
        // Update the order in state
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order.projectID === orderId 
              ? { ...order, description: data.updatedDescription }
              : order
          )
        );
        
        setEditingOrderId(null);
        setEditDescription('');
      } else {
        setError(data.error || 'Failed to update description');
      }
    } catch (err) {
      console.error('Error updating description:', err);
      setError('Failed to update description');
    } finally {
      setIsUpdating(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ongoing': return '#3498db'; // Blue
      case 'completed': return '#2ecc71'; // Green
      case 'cancelled': return '#e74c3c'; // Red
      case 'pending': return '#f39c12'; // Orange
      default: return '#95a5a6'; // Gray
    }
  };

  // Get delivery mode icon
  const getDeliveryIcon = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'postal mail': return '📮';
      case 'whatsapp': return '💬';
      case 'pick up': return '📦';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
        <style>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
            color: #fff;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: #9b59b6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <h2>Your Project Orders</h2>
      
      {success && (
        <div className="alert alert-success">
          <span>✅</span> {success}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          <span>❌</span> {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <a href="/user/dashboard/book" className="btn-new-order">Book Your First Project</a>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order.projectID} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <span className="order-icon">📋</span>
                  <h3>Order #{order.projectID}</h3>
                </div>
                <span 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status || 'Unknown'}
                </span>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Order Date:</span>
                  <span className="detail-value">{formatDate(order.order_date)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Required Deadline:</span>
                  <span className="detail-value">{formatDate(order.required_deadline)}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Estimated Deadline:</span>
                  <span className="detail-value">{formatDate(order.est_deadline) || 'Not set'}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Cost:</span>
                  <span className="detail-value cost">
                    {order.cost ? `$${parseFloat(order.cost).toFixed(2)}` : 'Not quoted yet'}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Delivery:</span>
                  <span className="detail-value delivery">
                    {getDeliveryIcon(order.deliverymode)} {order.deliverymode}
                  </span>
                </div>
                
                {order.payment_date && (
                  <div className="detail-row">
                    <span className="detail-label">Payment Date:</span>
                    <span className="detail-value">{formatDate(order.payment_date)}</span>
                  </div>
                )}
              </div>

              <div className="order-description">
                <h4>Project Description:</h4>
                {editingOrderId === order.projectID ? (
                  <div className="edit-description-form">
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Enter additional description or updates..."
                      rows="3"
                    />
                    <div className="edit-actions">
                      <button 
                        onClick={() => handleUpdateDescription(order.projectID)}
                        disabled={isUpdating || !editDescription.trim()}
                        className="btn-save"
                      >
                        {isUpdating ? 'Saving...' : 'Save Update'}
                      </button>
                      <button 
                        onClick={cancelEditing}
                        disabled={isUpdating}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                    <p className="edit-note">
                      <small>Note: New text will be appended with timestamp</small>
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="description-text">{order.description || 'No description provided'}</p>
                    <button 
                      onClick={() => startEditing(order)}
                      className="btn-edit"
                    >
                      ✏️ Add/Update Description
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Styles */}
      <style>{`
        .user-orders-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 1rem;
          color: #fff;
          font-family: Arial, sans-serif;
        }

        h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #b8b8ff;
          font-size: 2rem;
        }

        .alert {
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
        }

        .alert-success {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .alert-danger {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .no-orders {
          text-align: center;
          padding: 4rem 2rem;
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .no-orders p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: #ccc;
        }

        .btn-new-order {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .btn-new-order:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .order-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          border: 1px solid rgba(155, 89, 182, 0.2);
          padding: 1.5rem;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          border-color: rgba(155, 89, 182, 0.4);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .order-id {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .order-icon {
          font-size: 1.5rem;
        }

        .order-id h3 {
          margin: 0;
          color: #d1b3ff;
          font-size: 1.2rem;
        }

        .order-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .order-details {
          margin-bottom: 1.5rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: #a0a0c0;
          font-weight: 500;
        }

        .detail-value {
          color: #fff;
          font-weight: 500;
        }

        .cost {
          color: #2ecc71;
          font-weight: 600;
        }

        .delivery {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .order-description {
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .order-description h4 {
          margin: 0 0 0.75rem 0;
          color: #b8b8ff;
          font-size: 1rem;
        }

        .description-text {
          color: #ccc;
          line-height: 1.5;
          margin-bottom: 1rem;
          white-space: pre-line;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.75rem;
          border-radius: 8px;
          max-height: 150px;
          overflow-y: auto;
        }

        .edit-description-form {
          margin-top: 0.5rem;
        }

        .edit-description-form textarea {
          width: 100%;
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(155, 89, 182, 0.3);
          background: rgba(26, 26, 46, 0.8);
          color: #fff;
          font-size: 0.95rem;
          resize: vertical;
          margin-bottom: 0.75rem;
        }

        .edit-description-form textarea:focus {
          outline: none;
          border-color: #9b59b6;
        }

        .edit-actions {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .btn-save, .btn-cancel, .btn-edit {
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-save {
          background: linear-gradient(45deg, #2ecc71, #27ae60);
          color: white;
        }

        .btn-save:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 3px 10px rgba(46, 204, 113, 0.3);
        }

        .btn-cancel {
          background: rgba(255, 255, 255, 0.1);
          color: #ccc;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-cancel:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-edit {
          background: transparent;
          color: #9b59b6;
          border: 1px solid #9b59b6;
          width: 100%;
          padding: 0.75rem;
        }

        .btn-edit:hover {
          background: rgba(155, 89, 182, 0.1);
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none !important;
        }

        .edit-note {
          color: #888;
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 768px) {
          .orders-grid {
            grid-template-columns: 1fr;
          }
          
          .order-card {
            padding: 1.25rem;
          }
          
          .edit-actions {
            flex-direction: column;
          }
          
          .btn-save, .btn-cancel {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .user-orders-container {
            padding: 0.5rem;
          }
          
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          
          .order-status {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default UserOrders;