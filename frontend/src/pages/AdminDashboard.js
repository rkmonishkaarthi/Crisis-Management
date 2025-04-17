import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import './AdminDashboard.css';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [crises, setCrises] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const correctPasscode = '123';

  useEffect(() => {
    if (!authenticated) return;

    const fetchRequests = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/volunteers');
        const data = await res.json();
        setRequests(data);
      } catch (err) {
        console.error('Error fetching volunteer requests:', err);
      }
    };

    const fetchCrises = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/crises/pending');
        const data = await res.json();
        setCrises(data);
      } catch (err) {
        console.error('Error fetching pending crises:', err);
      }
    };

    fetchRequests();
    fetchCrises();
  }, [authenticated]);

  const handleStatusChange = async (id, status) => {
    try {
      const volunteer = requests.find(r => r._id === id);
      if (!volunteer) return;

      const updatedVolunteer = { ...volunteer, status };

      await fetch(`http://localhost:5000/api/volunteers/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVolunteer)
      });

      setRequests(requests.map(r => r._id === id ? updatedVolunteer : r));
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCrisisAction = async (id, approved) => {
    try {
      await fetch(`http://localhost:5000/api/crises/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: approved ? 'Approved' : 'Rejected' })
      });
      setCrises(crises.filter(crisis => crisis._id !== id));
    } catch (err) {
      console.error('Failed to update crisis status:', err);
    }
  };

  const handleLogin = () => {
    if (passcode === correctPasscode) {
      setAuthenticated(true);
    } else {
      alert('Incorrect passcode!');
    }
  };

  return (
    <div>
      <Header />
      {!authenticated ? (
        <form
          className="passcode-screen"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h2>Admin Passcode Required</h2>
          <input
            type="password"
            placeholder="Enter passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          <button type="submit">Enter</button>
        </form>
      ) : (
        <div className="admin-dashboard">
          <h2>Volunteer Requests</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Crisis</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.name}</td>
                  <td>{req.email}</td>
                  <td>{req.phone}</td>
                  <td>{req.address}</td>
                  <td>{req.crisisName || 'N/A'}</td>
                  <td>{req.status || 'Pending'}</td>
                  <td>
                    <button onClick={() => handleStatusChange(req._id, 'Approved')} className="approve-btn">Approve</button>
                    <button onClick={() => handleStatusChange(req._id, 'Rejected')} className="reject-btn">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Pending Crisis Reports</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Location</th><th>Severity</th><th>Description</th><th>Image</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crises.map((crisis) => (
                <tr key={crisis._id}>
                  <td>{crisis.title}</td>
                  <td>{crisis.location}</td>
                  <td>{crisis.severity}</td>
                  <td>{crisis.description}</td>
                  <td>
                    {crisis.image ? (
                      <>
                        <img
                          src={`http://localhost:5000/${crisis.image}`}
                          alt="Crisis"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                        />
                        <br />
                        <button
                          onClick={() => {
                            setSelectedImage(`http://localhost:5000/${crisis.image}`);
                            setShowModal(true);
                          }}
                          className="view-btn"
                        >
                          View
                        </button>
                      </>
                    ) : 'No image'}
                  </td>
                  <td>
                    <button onClick={() => handleCrisisAction(crisis._id, true)} className="approve-btn">Approve</button>
                    <button onClick={() => handleCrisisAction(crisis._id, false)} className="reject-btn">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <img src={selectedImage} alt="Full Crisis" className="modal-img" />
                <button onClick={() => setShowModal(false)} className="close-btn">Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
