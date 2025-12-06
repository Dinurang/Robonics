// updatePricing.jsx - Updated to match manageStaff.jsx UI styles
import { useState, useEffect } from 'react';
import axios from 'axios';

const UpdatePricing = () => {
  const [pricingList, setPricingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProjectType, setEditingProjectType] = useState(null);
  const [formData, setFormData] = useState({
    project_type: '',  // Note: backend expects project_type in POST/PUT
    pricing: '',
    duration: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchPricing();
  }, []);

  // Fetch all pricing entries
  const fetchPricing = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Your backend endpoint is at /api/updatePricing/
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/admin/updatepricing/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched data:', response.data); // Debug log
      setPricingList(response.data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error || 'Failed to fetch pricing data');
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
    
    if (!formData.project_type.trim()) {
      errors.project_type = 'Project type is required';
    }
    
    if (!formData.pricing) {
      errors.pricing = 'Pricing is required';
    } else if (parseFloat(formData.pricing) <= 0) {
      errors.pricing = 'Pricing must be greater than 0';
    }
    
    if (formData.duration && parseInt(formData.duration) <= 0) {
      errors.duration = 'Duration must be greater than 0';
    }
    
    return errors;
  };

  // Handle save (create or update)
  const handleSavePricing = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      const apiData = {
        project_type: formData.project_type,
        pricing: parseFloat(formData.pricing),
        duration: formData.duration ? parseInt(formData.duration) : null
      };
      
      console.log('Sending data:', apiData); // Debug log
      
      if (editingProjectType) {
        // For update, we might need to send new_projecttype if renaming
        const updateData = { ...apiData };
        if (formData.project_type !== editingProjectType) {
          updateData.new_projecttype = formData.project_type;
        }
        
        // Update existing - use projecttype as identifier
        const response = await axios.put(
          `http://localhost:5000/admin/updatepricing/${encodeURIComponent(editingProjectType)}`,
          updateData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update in list
        setPricingList(prev => prev.map(item => 
          item.projecttype === editingProjectType ? response.data : item
        ));
        
        setSuccess('Project pricing updated successfully');
      } else {
        // Create new
        const response = await axios.post(
          'http://localhost:5000/admin/updatepricing/',
          apiData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Add to list
        setPricingList(prev => [response.data, ...prev]);
        setSuccess('Project type added successfully');
      }
      
      // Reset form
      resetForm();
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.error || 'Failed to save project pricing');
    } finally {
      setSaving(false);
    }
  };

  // Handle edit - use projecttype as identifier
  const handleEdit = (item) => {
    console.log('Editing item:', item); // Debug log
    setFormData({
      project_type: item.projecttype || '',  // Use projecttype from database
      pricing: item.pricing,
      duration: item.duration || ''
    });
    setEditingProjectType(item.projecttype);
    setShowCreateForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete - use projecttype as identifier
  const handleDelete = async (projecttype) => {
    if (!window.confirm(`Are you sure you want to delete "${projecttype}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setDeleting(projecttype);
      setError(null);
      setSuccess(null);
      
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/admin/updatepricing/${encodeURIComponent(projecttype)}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove from list
      setPricingList(prev => prev.filter(item => item.projecttype !== projecttype));
      setSuccess(`Project type "${projecttype}" deleted successfully`);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete project type');
    } finally {
      setDeleting(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      project_type: '',
      pricing: '',
      duration: ''
    });
    setFormErrors({});
    setEditingProjectType(null);
    setShowCreateForm(false);
  };

  // Format price without dollar sign
  const formatPrice = (amount) => {
    if (!amount && amount !== 0) return '0.00';
    return parseFloat(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Format duration
  const formatDuration = (days) => {
    if (!days && days !== 0) return 'Flexible';
    return `${days} day${days === 1 ? '' : 's'}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading project pricing...</p>
      </div>
    );
  }

  return (
    <div className="manage-staff">
      {/* Header */}
      <div className="page-header">
        <h1><i className="fas fa-tags me-2"></i>Project Pricing Management</h1>
        
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
          <h3><i className="fas fa-money-bill-wave me-2"></i>Project Types ({pricingList.length})</h3>
          
        </div>
        <div className="actions-right">
          <button 
            onClick={() => {
              if (showCreateForm) {
                resetForm();
              } else {
                setShowCreateForm(true);
              }
            }}
            className="btn-create"
          >
            <i className="fas fa-plus-circle me-2"></i>
            {showCreateForm ? 'Cancel' : editingProjectType ? 'Cancel Edit' : 'Add Project Type'}
          </button>
          <button onClick={fetchPricing} className="btn-refresh">
            <i className="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="create-form-section">
          <div className="form-card">
            <div className="form-header">
              <h4>
                <i className="fas fa-edit me-2"></i>
                {editingProjectType ? 'Edit Project Type' : 'Add New Project Type'}
              </h4>
              <p>Fill in the details for the project type</p>
            </div>
            
            <form onSubmit={handleSavePricing} className="admin-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="project_type">
                    <i className="fas fa-project-diagram me-2"></i>
                    Project Type *
                  </label>
                  <input
                    type="text"
                    id="project_type"
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleInputChange}
                    placeholder="e.g., 20mm 3D print, Website Development, Mobile App"
                    className={`form-input ${formErrors.project_type ? 'error' : ''}`}
                    required
                    disabled={!!editingProjectType} // Can't edit project type name when editing
                  />
                  {formErrors.project_type && (
                    <div className="field-error">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.project_type}
                    </div>
                  )}
                  <small className="form-help">
                    <i className="fas fa-info-circle me-1"></i>
                    {editingProjectType 
                      ? 'Project type name cannot be changed. Delete and recreate if needed.' 
                      : 'Enter a descriptive name for the project type'}
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="pricing">
                    <i className="fas fa-dollar-sign me-2"></i>
                    Pricing *
                  </label>
                  <input
                    type="number"
                    id="pricing"
                    name="pricing"
                    value={formData.pricing}
                    onChange={handleInputChange}
                    placeholder="e.g., 1999.00"
                    step="0.01"
                    min="0"
                    className={`form-input ${formErrors.pricing ? 'error' : ''}`}
                    required
                  />
                  {formErrors.pricing && (
                    <div className="field-error">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.pricing}
                    </div>
                  )}
                  <small className="form-help">
                    <i className="fas fa-info-circle me-1"></i>
                    Enter the price in numeric format (e.g., 1999.00)
                  </small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="duration">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Duration (days) - Optional
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 (leave empty for flexible)"
                    min="0"
                    className={`form-input ${formErrors.duration ? 'error' : ''}`}
                  />
                  {formErrors.duration && (
                    <div className="field-error">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {formErrors.duration}
                    </div>
                  )}
                  <small className="form-help">
                    <i className="fas fa-info-circle me-1"></i>
                    Estimated completion time in days
                  </small>
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
                      {editingProjectType ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      {editingProjectType ? 'Update Project Type' : 'Add Project Type'}
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Table */}
      <div className="admins-table-container">
        <div className="table-card">
          <div className="table-header">
            <h4><i className="fas fa-list me-2"></i>Current Project Pricing</h4>
            <span className="table-info">{pricingList.length} project type(s) configured</span>
          </div>
          
          {pricingList.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-tag-slash"></i>
              </div>
              <h5>No Project Types Found</h5>
              <p>Start by adding your first project type and pricing</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn-create-first"
              >
                <i className="fas fa-plus-circle me-2"></i>
                Add First Project Type
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="admins-table">
                <thead>
                  <tr>
                    <th>Project Type</th>
                    <th>Pricing</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pricingList.map((item) => (
                    <tr key={item.projecttype}>
                      <td>
                        <div className="email-cell">
                          <i className="fas fa-folder me-2"></i>
                          {item.projecttype}
                          <div style={{ fontSize: '0.8rem', color: '#8888cc', marginTop: '2px' }}>
                            Primary Key
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="price-badge">
                          {formatPrice(item.pricing)}
                        </span>
                      </td>
                      <td>
                        <span className={`duration-badge ${!item.duration && item.duration !== 0 ? 'flexible' : 'fixed'}`}>
                          <i className={`fas ${!item.duration && item.duration !== 0 ? 'fa-infinity' : 'fa-calendar'} me-1`}></i>
                          {formatDuration(item.duration)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn-edit"
                            title="Edit Project Type"
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'linear-gradient(45deg, #3498db, #2980b9)',
                              color: 'white',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.projecttype)}
                            className="btn-delete"
                            disabled={deleting === item.projecttype}
                            title="Delete Project Type"
                          >
                            {deleting === item.projecttype ? (
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

        .form-input:disabled {
          background: rgba(26, 26, 46, 0.5);
          color: #8888cc;
          cursor: not-allowed;
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

        /* Administrators Table - Reused for Pricing */
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

        .email-cell {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          color: #ffffff;
          font-weight: 500;
        }

        /* Price Badge - NO DOLLAR SIGN */
        .price-badge {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          display: inline-block;
          font-size: 1.1rem;
        }

        .duration-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }

        .duration-badge.fixed {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border: 1px solid rgba(52, 152, 219, 0.3);
        }

        .duration-badge.flexible {
          background: rgba(155, 89, 182, 0.1);
          color: #9b59b6;
          border: 1px solid rgba(155, 89, 182, 0.3);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
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

export default UpdatePricing;