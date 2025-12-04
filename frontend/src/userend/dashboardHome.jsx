import { Link } from 'react-router-dom';
import { useAuth } from '../commonend/auth.jsx';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-home">
      

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/user/dashboard/book" className="showcase-card">
            <div className="action-icon">
              <i className="fas fa-plus"></i>
            </div>
            <div className="action-content">
              <h4>New Booking</h4>
              <p>Request new robotics service</p>
            </div>
            <i className="fas fa-arrow-right action-arrow"></i>
          </Link>
          
          <Link to="/user/dashboard/orders" className="showcase-card">
            <div className="action-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="action-content">
              <h4>View Orders</h4>
              <p>Track your service requests</p>
            </div>
            <i className="fas fa-arrow-right action-arrow"></i>
          </Link>
          
          <Link to="/user/dashboard/profile" className="showcase-card">
            <div className="action-icon">
              <i className="fas fa-user-edit"></i>
            </div>
            <div className="action-content">
              <h4>Update Profile</h4>
              <p>Edit your information</p>
            </div>
            <i className="fas fa-arrow-right action-arrow"></i>
          </Link>
          
          <a href="/" className="showcase-card">
            <div className="action-icon">
              <i className="fas fa-external-link-alt"></i>
            </div>
            <div className="action-content">
              <h4>Main Site</h4>
              <p>Return to homepage</p>
            </div>
            <i className="fas fa-arrow-right action-arrow"></i>
          </a>
        </div>
      </div>

      
      <style jsx>{`
        .dashboard-home {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        /* Stats Grid - Using home.jsx feature-card styling */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .feature-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 2rem;
          height: 100%;
          transition: all 0.3s ease;
          border: 1px solid transparent;
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: #9b59b6;
          box-shadow: 0 15px 30px rgba(155, 89, 182, 0.2);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #d1b3ff;
        }

        .feature-card h3 {
          color: #ffffff;
          margin-bottom: 0.5rem;
          font-size: 2.5rem;
          font-weight: 700;
        }

        .feature-card p {
          color: #b8b8ff;
          line-height: 1.6;
          margin: 0;
          font-size: 1rem;
        }

        /* Quick Actions */
        .quick-actions h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .showcase-card {
          background: #222238;
          border-radius: 15px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          text-decoration: none;
          position: relative;
          display: block;
        }

        .showcase-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .action-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.5rem;
          color: white;
        }

        .showcase-card h4 {
          color: #d1b3ff;
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .showcase-card p {
          color: #b8b8ff;
          font-size: 0.9rem;
          margin: 0;
        }

        .action-arrow {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #8e44ad;
          transition: all 0.3s ease;
        }

        .showcase-card:hover .action-arrow {
          color: #ffffff;
          transform: translateY(-50%) translateX(4px);
        }

        /* Recent Activity */
        .recent-activity {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 2rem;
          border: 1px solid rgba(155, 89, 182, 0.2);
        }

        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .activity-header h2 {
          font-size: 1.8rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }

        .view-all {
          color: #9b59b6;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .view-all:hover {
          color: #d1b3ff;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(26, 26, 46, 0.5);
          border-radius: 10px;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .activity-item:hover {
          background: rgba(155, 89, 182, 0.1);
          border-color: rgba(155, 89, 182, 0.3);
        }

        .activity-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .activity-icon.success {
          background: rgba(46, 204, 113, 0.1);
          color: #2ecc71;
          border: 1px solid rgba(46, 204, 113, 0.3);
        }

        .activity-icon.warning {
          background: rgba(241, 196, 15, 0.1);
          color: #f1c40f;
          border: 1px solid rgba(241, 196, 15, 0.3);
        }

        .activity-icon.info {
          background: rgba(52, 152, 219, 0.1);
          color: #3498db;
          border: 1px solid rgba(52, 152, 219, 0.3);
        }

        .activity-content {
          flex: 1;
        }

        .activity-content h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 0.25rem 0;
        }

        .activity-content p {
          color: #b8b8ff;
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
        }

        .activity-time {
          color: #8888cc;
          font-size: 0.8rem;
        }

        /* Responsive */
        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .actions-grid {
            grid-template-columns: 1fr;
          }
          
          .activity-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .activity-item {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .activity-icon {
            margin-bottom: 0.5rem;
          }
        }

        @media (max-width: 576px) {
          .feature-card {
            padding: 1.5rem;
          }

          .feature-card h3 {
            font-size: 2rem;
          }

          .quick-actions h2,
          .activity-header h2 {
            font-size: 1.5rem;
          }

          .showcase-card {
            padding: 1.25rem;
          }

          .recent-activity {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;