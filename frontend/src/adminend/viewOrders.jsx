// adminend/viewOrders.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../commonend/auth.jsx';
import axios from 'axios';

const ViewOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('newest');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');
  const [filterProjectStatus, setFilterProjectStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/vieworders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Log raw data to debug
      console.log('Raw API Response:', response.data);
      
      // Format the data to match expected structure
      const formattedOrders = response.data.map(order => ({
        ...order,
        // Use project_status from API (aliased in query) and map to status for frontend
        status: order.project_status || order.status || 'Unknown',
        // Ensure all date fields are properly formatted
        order_date: order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A',
        payment_date: order.payment_date ? new Date(order.payment_date).toLocaleDateString() : 'N/A',
        required_deadline: order.required_deadline ? new Date(order.required_deadline).toLocaleDateString() : 'Not Set',
        est_deadline: order.est_deadline ? new Date(order.est_deadline).toLocaleDateString() : 'Not Set',
        // Handle cost formatting
        cost: order.cost !== null && order.cost !== undefined ? parseFloat(order.cost).toFixed(2) : 'Not Set'
      }));
      
      console.log('Formatted Orders:', formattedOrders);
      setOrders(formattedOrders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort orders
  const getFilteredAndSortedOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        (order.username && order.username.toLowerCase().includes(searchLower)) ||
        (order.description && order.description.toLowerCase().includes(searchLower)) ||
        (order.userID && order.userID.toString().includes(searchTerm)) ||
        (order.whatsappNo && order.whatsappNo.includes(searchTerm))
      );
    }

    // Filter by date range
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(order => {
        if (!order.order_date || order.order_date === 'N/A') return false;
        
        const orderDate = new Date(order.order_date);
        const startDate = dateRange.start ? new Date(dateRange.start) : null;
        const endDate = dateRange.end ? new Date(dateRange.end) : null;
        
        if (startDate && endDate) {
          return orderDate >= startDate && orderDate <= endDate;
        } else if (startDate) {
          return orderDate >= startDate;
        } else if (endDate) {
          return orderDate <= endDate;
        }
        return true;
      });
    }

    // Filter by payment status
    if (filterPaymentStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.payment_status?.toLowerCase() === filterPaymentStatus.toLowerCase()
      );
    }

    // Filter by project status
    if (filterProjectStatus !== 'all') {
      filtered = filtered.filter(order => 
        order.status?.toLowerCase() === filterProjectStatus.toLowerCase()
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.order_date || 0);
      const dateB = new Date(b.order_date || 0);
      
      return filterDate === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  };

  const filteredOrders = getFilteredAndSortedOrders();

  // Toggle expanded view for order description
  const toggleExpandOrder = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Calculate statistics
  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => {
      const cost = parseFloat(order.cost);
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0),
    ongoingProjects: orders.filter(order => order.status?.toLowerCase() === 'ongoing').length,
    completeProjects: orders.filter(order => order.status?.toLowerCase() === 'complete').length,
    pendingProjects: orders.filter(order => order.status?.toLowerCase() === 'pending').length,
    completePayments: orders.filter(order => order.payment_status?.toLowerCase() === 'complete').length,
    incompletePayments: orders.filter(order => order.payment_status?.toLowerCase() === 'incomplete' || !order.payment_status).length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Orders</h3>
        <p>{error}</p>
        <button onClick={fetchOrders} className="btn-retry">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="view-orders">
      {/* Header */}
      <div className="page-header">
        <h1><i className="fas fa-shopping-bag me-2"></i>View Orders</h1>
        <p>Manage and monitor all customer orders and payments</p>
      </div>


      
      {/* Filter Controls */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label><i className="fas fa-search me-2"></i>Search</label>
            <input
              type="text"
              placeholder="Search by username, description, phone, or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <label><i className="fas fa-filter me-2"></i>Filters</label>
            <div className="filter-buttons">
              <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              
              <select value={filterPaymentStatus} onChange={(e) => setFilterPaymentStatus(e.target.value)}>
                <option value="all">All Payment Status</option>
                <option value="complete">Complete Payments</option>
                <option value="incomplete">Incomplete Payments</option>
              </select>
              
              <select value={filterProjectStatus} onChange={(e) => setFilterProjectStatus(e.target.value)}>
                <option value="all">All Project Status</option>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label><i className="far fa-calendar me-2"></i>Date Range</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="date-input"
                placeholder="Start Date"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="date-input"
                placeholder="End Date"
              />
              {(dateRange.start || dateRange.end) && (
                <button 
                  onClick={() => setDateRange({ start: '', end: '' })}
                  className="btn-clear-date"
                  title="Clear date range"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
          
          <div className="filter-group">
            <div className="action-row">
              <button onClick={fetchOrders} className="btn-refresh">
                <i className="fas fa-sync-alt me-2"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <div className="table-header">
          <h3><i className="fas fa-list me-2"></i>Orders ({filteredOrders.length})</h3>
          <span className="table-info">Showing {filteredOrders.length} of {orders.length} orders</span>
        </div>
        
        <div className="table-responsive">
          <table className="orders-table">
            <thead>
              <tr>
                <th style={{ width: '50px' }}></th>
                <th>Project ID</th>
                <th>Description</th>
                <th>Username</th>
                <th>WhatsApp No</th>
                <th>Address</th>
                <th>Order Date</th>
                <th>Cost (LKR)</th>
                <th>Project Status</th>
                <th>Payment Status</th>
                <th>Payment Date</th>
                <th>Required Deadline</th>
                <th>Estimated Deadline</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <>
                    <tr key={order.projectID || index}>
                      <td>
                        <button 
                          onClick={() => toggleExpandOrder(order.projectID)}
                          className="btn-expand"
                          title={expandedOrder === order.projectID ? "Hide details" : "Show full description"}
                        >
                          <i className={`fas ${expandedOrder === order.projectID ? 'fa-chevron-up' : 'fa-info-circle'}`}></i>
                        </button>
                      </td>
                      <td>
                        <span className="project-id">#{order.projectID || 'N/A'}</span>
                      </td>
                      <td>
                        <div className="description-cell">
                          <div className="description-text">
                            {order.description || 'No description'}
                          </div>
                          {order.deliverymode && (
                            <span className="delivery-badge">
                              <i className="fas fa-shipping-fast me-1"></i>
                              {order.deliverymode}
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="username-cell">
                          <i className="fas fa-user me-1"></i>
                          {order.username || `User #${order.userID || 'N/A'}`}
                        </span>
                      </td>
                      <td>
                        <span className="whatsapp-cell">
                          <i className="fab fa-whatsapp me-1"></i>
                          {order.whatsappNo || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="address-cell" title={order.postal_address}>
                          <i className="fas fa-map-marker-alt me-1"></i>
                          {order.postal_address ? 
                            (order.postal_address.length > 25 ? 
                              `${order.postal_address.substring(0, 25)}...` : 
                              order.postal_address) : 
                            'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          <i className="far fa-calendar me-1"></i>
                          {order.order_date}
                        </span>
                      </td>
                      <td>
                        <span className={`cost-cell ${order.cost && order.cost !== 'Not Set' ? 'has-cost' : 'no-cost'}`}>
                          {order.cost && order.cost !== 'Not Set' ? `$${order.cost}` : 'Not Set'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${order.status?.toLowerCase()}`}>
                          <i className={`fas ${
                            order.status?.toLowerCase() === 'complete' ? 'fa-check-circle' : 
                            order.status?.toLowerCase() === 'ongoing' ? 'fa-spinner' : 
                            order.status?.toLowerCase() === 'pending' ? 'fa-clock' : 
                            'fa-question-circle'
                          } me-1`}></i>
                          {order.status || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className={`payment-badge ${order.payment_status?.toLowerCase()}`}>
                          <i className={`fas ${
                            order.payment_status?.toLowerCase() === 'complete' ? 'fa-check-circle' : 
                            'fa-clock'
                          } me-1`}></i>
                          {order.payment_status || 'Unknown'}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          {order.payment_date && order.payment_date !== 'N/A' ? (
                            <>
                              <i className="far fa-calendar-check me-1"></i>
                              {order.payment_date}
                            </>
                          ) : (
                            <span className="no-date">Not Paid</span>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          {order.required_deadline && order.required_deadline !== 'Not Set' ? (
                            <>
                              <i className="far fa-calendar me-1"></i>
                              {order.required_deadline}
                            </>
                          ) : (
                            <span className="no-date">Not Set</span>
                          )}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">
                          {order.est_deadline && order.est_deadline !== 'Not Set' ? (
                            <>
                              <i className="far fa-clock me-1"></i>
                              {order.est_deadline}
                            </>
                          ) : (
                            <span className="no-date">Not Set</span>
                          )}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Expanded Description Row */}
                    {expandedOrder === order.projectID && (
                      <tr className="expanded-row">
                        <td colSpan="13">
                          <div className="expanded-content">
                            <div className="expanded-header">
                              <h4>
                                <i className="fas fa-file-alt me-2"></i>
                                Full Details for Order #{order.projectID}
                              </h4>
                              <button 
                                onClick={() => toggleExpandOrder(order.projectID)}
                                className="btn-close-expanded"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                            <div className="expanded-grid">
                              <div className="expanded-section">
                                <h5><i className="fas fa-align-left me-2"></i>Project Description</h5>
                                <div className="expanded-description">
                                  {order.description || 'No description provided'}
                                </div>
                              </div>
                              <div className="expanded-section">
                                <h5><i className="fas fa-user me-2"></i>Customer Information</h5>
                                <div className="customer-details">
                                  <p><strong>Username:</strong> {order.username || 'N/A'}</p>
                                  <p><strong>User ID:</strong> {order.userID || 'N/A'}</p>
                                  <p><strong>WhatsApp:</strong> {order.whatsappNo || 'N/A'}</p>
                                  <p><strong>Full Address:</strong> {order.postal_address || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="expanded-section">
                                <h5><i className="fas fa-cog me-2"></i>Project Details</h5>
                                <div className="project-details">
                                  <p><strong>Delivery Mode:</strong> {order.deliverymode || 'Not specified'}</p>
                                  <p><strong>Project Status:</strong> <span className={`status-badge ${order.status?.toLowerCase()}`}>
                                    {order.status || 'Unknown'}
                                  </span></p>
                                  <p><strong>Payment Status:</strong> <span className={`payment-badge ${order.payment_status?.toLowerCase()}`}>
                                    {order.payment_status || 'Unknown'}
                                  </span></p>
                                  <p><strong>Cost:</strong> {order.cost && order.cost !== 'Not Set' ? `$${order.cost}` : 'Not Set'}</p>
                                </div>
                              </div>
                              <div className="expanded-section">
                                <h5><i className="far fa-calendar me-2"></i>Timeline</h5>
                                <div className="timeline-details">
                                  <p><strong>Order Date:</strong> {order.order_date}</p>
                                  <p><strong>Payment Date:</strong> {order.payment_date && order.payment_date !== 'N/A' ? order.payment_date : 'Not Paid'}</p>
                                  <p><strong>Required Deadline:</strong> {order.required_deadline && order.required_deadline !== 'Not Set' ? order.required_deadline : 'Not Set'}</p>
                                  <p><strong>Estimated Deadline:</strong> {order.est_deadline && order.est_deadline !== 'Not Set' ? order.est_deadline : 'Not Set'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="no-data">
                    <div className="no-data-content">
                      <i className="fas fa-inbox"></i>
                      <p>No orders found matching your filters</p>
                      <button onClick={() => {
                        setSearchTerm('');
                        setDateRange({ start: '', end: '' });
                        setFilterPaymentStatus('all');
                        setFilterProjectStatus('all');
                      }} className="btn-clear-filters">
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .view-orders {
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

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 1.5rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
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
          min-width: 300px;
        }

        .filter-group label {
          display: flex;
          align-items: center;
          color: #d1b3ff;
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .search-input {
          width: 100%;
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

        .filter-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .filter-buttons select {
          flex: 1;
          min-width: 180px;
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          color: #ffffff;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-buttons select:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2);
        }

        /* Date Range */
        .date-range-inputs {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .date-input {
          flex: 1;
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.8);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          color: #ffffff;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .date-input:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 2px rgba(155, 89, 182, 0.2);
        }

        .date-separator {
          color: #b8b8ff;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .btn-clear-date {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-clear-date:hover {
          background: rgba(231, 76, 60, 0.3);
          transform: translateY(-2px);
        }

        .action-row {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .btn-refresh {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          display: flex;
          align-items: center;
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
        }

        .btn-refresh:hover {
          background: linear-gradient(45deg, #2980b9, #3498db);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
        }

        /* Expand Button */
        .btn-expand {
          background: transparent;
          border: none;
          color: #9b59b6;
          font-size: 1.1rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .btn-expand:hover {
          background: rgba(155, 89, 182, 0.1);
          color: #8e44ad;
          transform: scale(1.1);
        }

        /* Orders Table */
        .orders-table-container {
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

        .table-header h3 {
          color: #ffffff;
          font-size: 1.5rem;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .table-info {
          color: #b8b8ff;
          font-size: 0.9rem;
        }

        .table-responsive {
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1450px;
        }

        .orders-table thead {
          background: rgba(26, 26, 46, 0.8);
          border-bottom: 2px solid rgba(155, 89, 182, 0.3);
        }

        .orders-table th {
          padding: 1rem;
          text-align: left;
          color: #d1b3ff;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .orders-table tbody tr {
          border-bottom: 1px solid rgba(155, 89, 182, 0.1);
          transition: all 0.3s ease;
        }

        .orders-table tbody tr:hover {
          background: rgba(155, 89, 182, 0.05);
        }

        .orders-table td {
          padding: 1rem;
          color: #e0e0f0;
          vertical-align: middle;
        }

        /* Expanded Row */
        .expanded-row {
          background: rgba(26, 26, 46, 0.9) !important;
          border-top: 2px solid rgba(155, 89, 182, 0.2);
        }

        .expanded-content {
          padding: 1.5rem;
        }

        .expanded-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(155, 89, 182, 0.3);
        }

        .expanded-header h4 {
          color: #ffffff;
          font-size: 1.2rem;
          margin: 0;
          display: flex;
          align-items: center;
        }

        .btn-close-expanded {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-close-expanded:hover {
          background: rgba(231, 76, 60, 0.3);
          transform: scale(1.1);
        }

        .expanded-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .expanded-section {
          background: rgba(34, 34, 56, 0.5);
          border-radius: 10px;
          padding: 1.25rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .expanded-section h5 {
          color: #d1b3ff;
          font-size: 1rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .expanded-description {
          color: #ffffff;
          line-height: 1.6;
          white-space: pre-wrap;
          max-height: 200px;
          overflow-y: auto;
          padding-right: 0.5rem;
        }

        .expanded-description::-webkit-scrollbar {
          width: 6px;
        }

        .expanded-description::-webkit-scrollbar-track {
          background: rgba(26, 26, 46, 0.3);
          border-radius: 3px;
        }

        .expanded-description::-webkit-scrollbar-thumb {
          background: rgba(155, 89, 182, 0.5);
          border-radius: 3px;
        }

        .customer-details p,
        .project-details p,
        .timeline-details p {
          margin-bottom: 0.75rem;
          color: #e0e0f0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .customer-details strong,
        .project-details strong,
        .timeline-details strong {
          color: #d1b3ff;
          min-width: 140px;
        }

        /* Cell Styles */
        .project-id {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .description-cell {
          max-width: 250px;
        }

        .description-text {
          color: #ffffff;
          margin-bottom: 0.5rem;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .delivery-badge {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          display: inline-flex;
          align-items: center;
        }

        .username-cell {
          display: flex;
          align-items: center;
          color: #d1b3ff;
          font-weight: 500;
        }

        .whatsapp-cell {
          display: flex;
          align-items: center;
          color: #25D366;
          font-weight: 500;
        }

        .address-cell {
          display: flex;
          align-items: center;
          color: #aaaaff;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: help;
        }

        .date-cell {
          display: flex;
          align-items: center;
          color: #aaaaff;
          font-size: 0.95rem;
        }

        .no-date {
          color: #8888cc;
          font-style: italic;
          font-size: 0.9rem;
        }

        .cost-cell {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .cost-cell.has-cost {
          color: #2ecc71;
        }

        .cost-cell.no-cost {
          color: #e74c3c;
        }

        /* Status Badges */
        .status-badge, .payment-badge {
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

        /* Loading and Error States */
        .loading-container, .error-container {
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

        .error-container .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .error-container h3 {
          color: #e74c3c;
          margin-bottom: 0.5rem;
        }

        .error-container p {
          color: #b8b8ff;
          margin-bottom: 1.5rem;
        }

        .btn-retry {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #e74c3c, #c0392b);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-retry:hover {
          background: linear-gradient(45deg, #c0392b, #e74c3c);
          transform: translateY(-2px);
        }

        /* No Data */
        .no-data {
          text-align: center;
          padding: 3rem !important;
        }

        .no-data-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .no-data-content i {
          font-size: 3rem;
          color: #6c757d;
        }

        .no-data-content p {
          color: #b8b8ff;
          font-size: 1.1rem;
        }

        .btn-clear-filters {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-clear-filters:hover {
          background: linear-gradient(45deg, #8e44ad, #9b59b6);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .view-orders {
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .filter-row {
            flex-direction: column;
          }
          
          .filter-group {
            min-width: 100%;
          }
          
          .filter-buttons select {
            min-width: 100%;
          }
          
          .date-range-inputs {
            flex-direction: column;
            align-items: stretch;
          }
          
          .date-separator {
            text-align: center;
          }
          
          .action-row {
            flex-direction: column;
            margin-top: 1rem;
          }
          
          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .expanded-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewOrders;