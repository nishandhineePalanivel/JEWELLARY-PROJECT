import React, { useState } from 'react';
import './Jewel.css'; // optional: shared styling

const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    feedback: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Complaint submitted:', formData);

    setSuccess(true);

    // Clear form
    setFormData({
      email: '',
      phone: '',
      feedback: ''
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">📩 Contact Us</h2>

      {success && (
        <div className="alert alert-success text-center" role="alert">
          Complaint added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow">
        <div className="mb-3">
          <label className="form-label">Our Email ID</label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="yourname@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="e.g., 9876543210"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Complaint / Feedback</label>
          <textarea
            name="feedback"
            className="form-control"
            rows="4"
            placeholder="Enter your message here..."
            value={formData.feedback}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default ContactUs;