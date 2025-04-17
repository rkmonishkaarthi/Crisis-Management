import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import './Volunteer.css';

const VolunteerRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    availability: '',
    crisisName: ''
  });

  const [crises, setCrises] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/volunteers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Request submitted to admin!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          availability: '',
          crisisName: ''
        });
      } else {
        alert('Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting volunteer request:', error);
      alert('Error submitting request');
    }
  };

  useEffect(() => {
    const fetchCrises = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/crises/approved');
        const data = await res.json();
        setCrises(data);
      } catch (error) {
        console.error('Error fetching crises:', error);
      }
    };
    fetchCrises();
  }, []);

  return (
    <div>
      <Header />
      <div className="volunteer-form-container">
        <h2>📌 Ongoing Crises</h2>
        <ul className="crisis-list">
          {crises.length > 0 ? (
            crises.map((crisis, index) => (
              <li key={index} className="crisis-item">
                <h3>{crisis.title}</h3>
                <p>{crisis.description}</p>
                <p><strong>📍 Location:</strong> {crisis.location}</p>
                <p><strong>🚨 Severity:</strong> {crisis.severity}</p>
                {crisis.image && (
                  <img
                    src={`http://localhost:5000/${crisis.image}`}
                    alt="Crisis"
                    style={{
                      width: '250px',
                      height: '150px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginTop: '10px'
                    }}
                    onError={(e) => (e.target.src = 'https://via.placeholder.com/250x150')}
                  />
                )}
              </li>
            ))
          ) : (
            <p>No active crises at the moment.</p>
          )}
        </ul>

        <h2>🙋 Volunteer for a Crisis</h2>
        <form onSubmit={handleSubmit} className="volunteer-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <select
            name="crisisName"
            value={formData.crisisName}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a crisis --</option>
            {crises.map((crisis, index) => (
              <option key={index} value={crisis.title}>
                {crisis.title}
              </option>
            ))}
          </select>
          <textarea
            name="availability"
            placeholder="Availability and Skills"
            value={formData.availability}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">✅ Click here to Volunteer</button>
        </form>
      </div>
    </div>
  );
};

export default VolunteerRequest;
