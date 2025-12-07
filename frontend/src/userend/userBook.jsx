// import { useState, useEffect } from 'react';
// import { useAuth } from '../commonend/auth.jsx';

// const UserBook = () => {
//   const { user } = useAuth();
//   const [formData, setFormData] = useState({
//     description: '',
//     required_deadline: '',
//     deliverymode: 'whatsapp'
//   });
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     fetchUserProjects();
//   }, []);

//   const fetchUserProjects = async () => {
//     try {
//       const response = await fetch('http://localhost:5000/user/book', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       const data = await response.json();
//       if (data.success) setProjects(data.projects);
//     } catch (err) {
//       console.error('Error fetching projects:', err);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setSuccessMessage('');
//     setErrorMessage('');

//     try {
//       const response = await fetch('http://localhost:5000/user/book', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       if (data.success) {
//         setSuccessMessage('Project booked successfully!');
//         setFormData({ description: '', required_deadline: '', deliverymode: 'whatsapp' });
//         fetchUserProjects();
//       } else {
//         setErrorMessage(data.error || 'Failed to book project');
//       }
//     } catch (err) {
//       console.error('Error booking project:', err);
//       setErrorMessage('Failed to book project');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="user-book-container">
//       <h2>Book a New Project</h2>

//       {successMessage && <div className="alert alert-success">{successMessage}</div>}
//       {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

//       <form onSubmit={handleSubmit} className="book-form">
//         <div className="form-group">
//           <label htmlFor="description">Description *</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             required
//             rows="3"
//             placeholder="Enter project description"
//           />
//         </div>

//         <div className="form-group date-group">
//           <label htmlFor="required_deadline">Required Deadline *</label>
//           {/* <div className="date-input-wrapper"> */}
//             <input
//               type="date"
//               id="required_deadline"
//               name="required_deadline"
//               value={formData.required_deadline}
//               onChange={handleInputChange}
//               required
//             />
//           {/* </div> */}
//         </div>

//         <div className="form-group">
//           <label htmlFor="deliverymode">Delivery Mode *</label>
//           <select
//             id="deliverymode"
//             name="deliverymode"
//             value={formData.deliverymode}
//             onChange={handleInputChange}
//           >
//             <option value="whatsapp">WhatsApp</option>
//             <option value="postal mail">Postal Mail</option>
//             <option value="pick up">Pick Up</option>
//           </select>
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? 'Booking...' : 'Book Project'}
//         </button>
//       </form>

//       {/* Styles */}
//       <style>{`
//         .user-book-container {
//           max-width: 900px;
//           margin: 2rem auto;
//           padding: 1rem;
//           color: #fff;
//           font-family: Arial, sans-serif;
//         }

//         h2, h3 {
//           text-align: center;
//           margin-bottom: 1.5rem;
//           color: #b8b8ff;
//         }

//         .alert {
//           padding: 1rem 1.5rem;
//           margin-bottom: 1.5rem;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           font-weight: 600;
//         }

//         .alert-success {
//           background: rgba(46, 204, 113, 0.1);
//           color: #2ecc71;
//           border: 1px solid rgba(46, 204, 113, 0.3);
//         }

//         .alert-danger {
//           background: rgba(231, 76, 60, 0.1);
//           color: #e74c3c;
//           border: 1px solid rgba(231, 76, 60, 0.3);
//         }

//         .book-form {
//           background: linear-gradient(145deg, #222238, #1a1a2e);
//           padding: 2rem;
//           border-radius: 15px;
//           border: 1px solid rgba(155, 89, 182, 0.2);
//           display: flex;
//           flex-direction: column;
//           gap: 1.5rem;
//           margin-bottom: 2rem;
//         }

//         .form-group {
//           display: flex;
//           flex-direction: column;
//           gap: 0.5rem;
//         }

//         label {
//           font-weight: 600;
//           color: #d1b3ff;
//         }

//         input, select, textarea {
//           padding: 0.75rem 1rem;
//           border-radius: 8px;
//           border: 1px solid rgba(155, 89, 182, 0.3);
//           background: rgba(26, 26, 46, 0.5);
//           color: #fff;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//         }

//         .date-input-wrapper {
//           position: relative;
//           color: #fff;
//         }

        

//         .date-input-wrapper input {
//           padding-left: 2.5rem;
//           color : #fff;
//         }
        

//         input:focus, select:focus, textarea:focus {
//           outline: none;
//           border-color: #9b59b6;
//           box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
//         }

//         button {
//           background: linear-gradient(45deg, #9b59b6, #8e44ad);
//           color: #fff;
//           font-weight: 600;
//           padding: 0.75rem 2rem;
//           border-radius: 25px;
//           border: none;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           align-self: center;
//         }

//         button:hover {
//           background: linear-gradient(45deg, #8e44ad, #9b59b6);
//           transform: translateY(-2px);
//           box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
//         }

//         button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         @media (max-width: 768px) {
//           .book-form {
//             padding: 1.5rem;
//           }

//           input, select, textarea {
//             font-size: 0.95rem;
//           }
//         }

//         @media (max-width: 576px) {
//           .user-book-container {
//             padding: 0.5rem;
//           }

//           button {
//             width: 100%;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default UserBook;

import { useState, useEffect } from 'react';
import { useAuth } from '../commonend/auth.jsx';

const UserBook = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    required_deadline: '',
    deliverymode: 'whatsapp'
  });
  const [zipFile, setZipFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchUserProjects();
  }, []);

  const fetchUserProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/user/book', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.success) setProjects(data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        if (file.size <= 50 * 1024 * 1024) { // 50MB limit
          setZipFile(file);
          setFileName(file.name);
        } else {
          setErrorMessage('File size must be less than 50MB');
          e.target.value = '';
        }
      } else {
        setErrorMessage('Only ZIP files are allowed');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('description', formData.description);
      formDataToSend.append('required_deadline', formData.required_deadline);
      formDataToSend.append('deliverymode', formData.deliverymode);
      
      if (zipFile) {
        formDataToSend.append('zipFile', zipFile);
      }

      const response = await fetch('http://localhost:5000/user/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // Don't set Content-Type header for FormData - browser will set it automatically
        },
        body: formDataToSend
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(data.message || 'Project booked successfully!');
        setFormData({ description: '', required_deadline: '', deliverymode: 'whatsapp' });
        setZipFile(null);
        setFileName('');
        document.getElementById('zipFileInput').value = '';
        fetchUserProjects();
      } else {
        setErrorMessage(data.error || 'Failed to book project');
      }
    } catch (err) {
      console.error('Error booking project:', err);
      setErrorMessage('Failed to book project');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setZipFile(null);
    setFileName('');
    document.getElementById('zipFileInput').value = '';
  };

  return (
    <div className="user-book-container">
      <h2>Book a New Project</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Enter project description"
          />
        </div>

        <div className="form-group date-group">
          <label htmlFor="required_deadline">Required Deadline *</label>
          <input
            type="date"
            id="required_deadline"
            name="required_deadline"
            value={formData.required_deadline}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="deliverymode">Delivery Mode *</label>
          <select
            id="deliverymode"
            name="deliverymode"
            value={formData.deliverymode}
            onChange={handleInputChange}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="postal mail">Postal Mail</option>
            <option value="pick up">Pick Up</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="zipFileInput">Upload ZIP File (Optional)</label>
          <div className="file-upload-container">
            <input
              type="file"
              id="zipFileInput"
              accept=".zip"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="file-upload-btn"
              onClick={() => document.getElementById('zipFileInput').click()}
            >
              Choose ZIP File
            </button>
            {fileName && (
              <div className="file-info">
                <span>{fileName}</span>
                <button type="button" className="remove-file-btn" onClick={removeFile}>
                  ×
                </button>
              </div>
            )}
            <small className="file-hint">Max 50MB, .zip format only</small>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Booking...' : 'Book Project'}
        </button>
      </form>

      {/* Styles */}
      <style>{`
        .user-book-container {
          max-width: 900px;
          margin: 2rem auto;
          padding: 1rem;
          color: #fff;
          font-family: Arial, sans-serif;
        }

        h2, h3 {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #b8b8ff;
        }

        .alert {
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
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

        .book-form {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(155, 89, 182, 0.2);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        label {
          font-weight: 600;
          color: #d1b3ff;
        }

        input, select, textarea {
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(155, 89, 182, 0.3);
          background: rgba(26, 26, 46, 0.5);
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .date-input-wrapper {
          position: relative;
          color: #fff;
        }

        .date-input-wrapper input {
          padding-left: 2.5rem;
          color: #fff;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #9b59b6;
          box-shadow: 0 0 0 3px rgba(155, 89, 182, 0.1);
        }

        /* File upload styles */
        .file-upload-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-upload-btn {
          background: rgba(155, 89, 182, 0.2);
          color: #d1b3ff;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          border: 1px dashed rgba(155, 89, 182, 0.5);
          cursor: pointer;
          text-align: center;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .file-upload-btn:hover {
          background: rgba(155, 89, 182, 0.3);
          border-color: #9b59b6;
        }

        .file-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          background: rgba(26, 26, 46, 0.5);
          border-radius: 8px;
          border: 1px solid rgba(155, 89, 182, 0.3);
        }

        .file-info span {
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 80%;
        }

        .remove-file-btn {
          background: rgba(231, 76, 60, 0.2);
          color: #e74c3c;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .remove-file-btn:hover {
          background: rgba(231, 76, 60, 0.3);
        }

        .file-hint {
          color: #888;
          font-size: 0.85rem;
        }

        button[type="submit"] {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          color: #fff;
          font-weight: 600;
          padding: 0.75rem 2rem;
          border-radius: 25px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: center;
          margin-top: 1rem;
        }

        button[type="submit"]:hover {
          background: linear-gradient(45deg, #8e44ad, #9b59b6);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(155, 89, 182, 0.3);
        }

        button[type="submit"]:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .book-form {
            padding: 1.5rem;
          }

          input, select, textarea {
            font-size: 0.95rem;
          }
        }

        @media (max-width: 576px) {
          .user-book-container {
            padding: 0.5rem;
          }

          button[type="submit"] {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default UserBook;