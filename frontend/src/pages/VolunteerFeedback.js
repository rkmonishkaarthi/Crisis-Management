import React, { useState } from 'react';
import Header from '../components/Header';
import './VolunteerFeedback.css';

function VolunteerFeedback() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback_type: '',
    liked: [],
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleStarClick = (value) => setRating(value);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      let updated = [...formData.liked];
      if (checked) {
        updated.push(value);
      } else {
        updated = updated.filter((item) => item !== value);
      }
      setFormData({ ...formData, liked: updated });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      access_key: '5c579b54-98b4-40d0-aeaa-dcf9e5989055',
      rating,
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          feedback_type: '',
          liked: [],
          message: ''
        });
        setRating(0);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <section className="feedback-container">
        <div className="feedback-card">
          <h2>Volunteer Feedback & Suggestions 💬</h2>
          <p className="subtext">Let us know how we’re doing</p>

          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name (optional)"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <select
                name="feedback_type"
                required
                value={formData.feedback_type}
                onChange={handleChange}
              >
                <option value="">Select Feedback Type</option>
                <option value="Appreciation">Appreciation</option>
                <option value="Complaint">Complaint</option>
                <option value="Suggestion">Suggestion</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              {['Coordination', 'Communication', 'Support Team', 'Tech Platform'].map((option) => (
                <label key={option}>
                  <input
                    type="checkbox"
                    name="liked"
                    value={option}
                    checked={formData.liked.includes(option)}
                    onChange={handleChange}
                  /> {option}
                </label>
              ))}
            </div>

            <div className="form-group">
              <textarea
                name="message"
                rows="4"
                required
                placeholder="Your Message or Suggestions"
                value={formData.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-group star-rating">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((val) => (
                  <span
                    key={val}
                    className={val <= rating ? 'filled' : ''}
                    onClick={() => handleStarClick(val)}
                  >★</span>
                ))}
              </div>
            </div>

            <button type="submit">Submit Feedback</button>
          </form>
        </div>
      </section>

      {/* Full Page Thank You Popup */}
      {submitted && (
        <div className="thank-you-overlay">
          <div className="thank-you-box">
            <h2>🎉 Thank You!</h2>
            <p>Your feedback has been submitted successfully.</p>
            <button onClick={() => setSubmitted(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default VolunteerFeedback;
