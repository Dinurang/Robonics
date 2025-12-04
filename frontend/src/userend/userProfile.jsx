// userend/userProfile.jsx - COMPLETELY FIXED
import { useState, useEffect } from 'react';
import { useAuth } from '../commonend/auth.jsx';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    whatsappNo: '',
    postal_address: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      // IMPORTANT: First check if backend is running
      console.log('Testing backend connection...');
      
     
      const response = await fetch('http://localhost:5000/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
        setFormData({
          whatsappNo: data.profile.whatsappNo || data.profile.whatsappno || '',
          postal_address: data.profile.postal_address || ''
        });
      } else {
        setErrorMessage(data.error || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMessage(`Failed to load profile. Error: ${error.message}. Make sure backend is running on port 5000.`);
    } finally {
      setLoading(false);
    }
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
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:5000/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.profile);
        setSuccessMessage('Profile updated successfully!');
        setEditing(false);
        
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else {
        setErrorMessage(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      whatsappNo: profile?.whatsappNo || profile?.whatsappno || '',
      postal_address: profile?.postal_address || ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-purple" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your profile...</p>
        {/* FIXED: Removed jsx attribute */}
        <style>{`
          .profile-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            min-height: 400px;
          }
          .spinner-border.text-purple {
            color: #9b59b6;
            width: 3rem;
            height: 3rem;
            margin-bottom: 1rem;
          }
          .profile-loading p {
            color: #b8b8ff;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h2><i className="fas fa-user-circle me-2"></i>My Profile</h2>
        <p className="profile-subtitle">Manage your personal information</p>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-profile">
          <i className="fas fa-check-circle me-2"></i>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger alert-profile">
          <i className="fas fa-exclamation-circle me-2"></i>
          {errorMessage}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-header-bar">
          <h3>Personal Information</h3>
          {!editing && (
            <button 
              className="btn-edit-profile"
              onClick={() => setEditing(true)}
            >
              <i className="fas fa-edit me-2"></i>
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="username">
                  <i className="fas fa-envelope me-2"></i>
                  Email Address
                </label>
                <input
                  type="email"
                  id="username"
                  value={profile?.username || ''}
                  disabled
                  className="form-input disabled"
                />
                <small className="form-help">Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label htmlFor="whatsappNo">
                  <i className="fab fa-whatsapp me-2"></i>
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  id="whatsappNo"
                  name="whatsappNo"
                  value={formData.whatsappNo}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 0771234567"
                  required
                />
                <small className="form-help">Enter your WhatsApp number for communication</small>
              </div>

              <div className="form-group">
                <label htmlFor="postal_address">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Postal Address *
                </label>
                <textarea
                  id="postal_address"
                  name="postal_address"
                  value={formData.postal_address}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Enter your full address"
                  rows="3"
                  required
                />
                <small className="form-help">Your service delivery address</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                <i className="fas fa-times me-2"></i>
                Cancel
              </button>
              <button type="submit" className="btn-save">
                <i className="fas fa-save me-2"></i>
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">
                  <i className="fas fa-envelope"></i>
                  Email Address
                </div>
                <div className="detail-value">{profile?.username || 'Not set'}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">
                  <i className="fab fa-whatsapp"></i>
                  WhatsApp Number
                </div>
                <div className="detail-value">
                  {profile?.whatsappNo || profile?.whatsappno ? (
                    <a 
                      href={`https://wa.me/${profile.whatsappNo || profile.whatsappno}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="whatsapp-link"
                    >
                      {profile.whatsappNo || profile.whatsappno}
                      <i className="fas fa-external-link-alt ms-2"></i>
                    </a>
                  ) : 'Not set'}
                </div>
              </div>

              <div className="detail-item full-width">
                <div className="detail-label">
                  <i className="fas fa-map-marker-alt"></i>
                  Postal Address
                </div>
                <div className="detail-value address-value">
                  {profile?.postal_address || 'Not set'}
                </div>
              </div>

              
            </div>
          </div>
        )}
      </div>

      {/* FIXED: Removed jsx attribute - This was causing the warning */}
      <style>{`
        .user-profile-container {
          padding: 0 1rem;
        }

        .profile-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .profile-header h2 {
          color: #ffffff;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-subtitle {
          color: #b8b8ff;
          font-size: 1rem;
        }

        .alert-profile {
          border-radius: 10px;
          border: none;
          margin-bottom: 1.5rem;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
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

        .profile-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
          max-width: 900px;
          margin: 0 auto;
        }

        .profile-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(155, 89, 182, 0.2);
        }

        .profile-header-bar h3 {
          color: #ffffff;
          font-size: 1.5rem;
          margin: 0;
        }

        .btn-edit-profile {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
          border: none;
          padding: 0.5rem 1.5rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .btn-edit-profile:hover {
          background: linear-gradient(45deg, #8e44ad, #9b59b6);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          color: #d1b3ff;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .form-input, .form-textarea {
          background: rgba(26, 26, 46, 0.5);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #ffffff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
        }

        .form-input.disabled {
          background: rgba(26, 26, 46, 0.3);
          color: #8888cc;
          cursor: not-allowed;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-help {
          color: #8888cc;
          font-size: 0.85rem;
          margin-top: 0.25rem;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(155, 89, 182, 0.2);
        }

        .btn-cancel, .btn-save {
          padding: 0.75rem 2rem;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-cancel {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border: 1px solid rgba(231, 76, 60, 0.3);
        }

        .btn-cancel:hover {
          background: rgba(231, 76, 60, 0.2);
        }

        .btn-save {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
        }

        .btn-save:hover {
          background: linear-gradient(45deg, #8e44ad, #9b59b6);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
        }

        .profile-details {
          padding: 1rem 0;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.25rem;
          background: rgba(26, 26, 46, 0.5);
          border-radius: 10px;
          border: 1px solid rgba(155, 89, 182, 0.1);
          transition: all 0.3s ease;
        }

        .detail-item:hover {
          border-color: rgba(155, 89, 182, 0.3);
          transform: translateY(-2px);
        }

        .detail-item.full-width {
          grid-column: 1 / -1;
        }

        .detail-label {
          color: #d1b3ff;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-value {
          color: #ffffff;
          font-size: 1.1rem;
        }

        .role-badge {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          display: inline-block;
        }

        .whatsapp-link {
          color: #25D366;
          text-decoration: none;
          display: flex;
          align-items: center;
          transition: all 0.3s ease;
        }

        .whatsapp-link:hover {
          color: #1da851;
          text-decoration: underline;
        }

        .address-value {
          line-height: 1.6;
          word-break: break-word;
        }

        @media (max-width: 768px) {
          .profile-card {
            padding: 1.5rem;
          }

          .profile-header-bar {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-cancel, .btn-save {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .profile-header h2 {
            font-size: 1.5rem;
          }

          .profile-card {
            padding: 1rem;
          }

          .detail-item {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;