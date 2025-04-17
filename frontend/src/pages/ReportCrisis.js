//ReportCrisis.js
import React, { useState } from 'react';
import Header from '../components/Header';
import './ReportCrisis.css';

function ReportCrisis() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    severity: '',
    description: '',
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('location', formData.location);
    data.append('severity', formData.severity);
    data.append('description', formData.description);
    if (image) {
      data.append('image', image);
    }

    try {
      const res = await fetch('http://localhost:5000/api/crises', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        setMessage('Crisis reported successfully!');
        setFormData({ title: '', location: '', severity: '', description: '' });
        setImage(null);
      } else {
        setMessage('Failed to report the crisis.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error reporting the crisis.');
    }
  };

  return (
    <div>
      <Header />
      <div className="report-container">
        <h2>Report a Crisis</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" placeholder="Name of the Crisis" value={formData.title} onChange={handleChange} required />
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
          <input type="text" name="severity" placeholder="Severity" value={formData.severity} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required></textarea>
          
          {/* Image Upload */}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <button type="submit">Submit</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ReportCrisis;
