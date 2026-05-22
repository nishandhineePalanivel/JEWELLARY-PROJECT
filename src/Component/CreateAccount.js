import React, { useState } from 'react';
import './Jewel.css'; // Optional: if you want to apply styles

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate form submission
    console.log('Account Created:', formData);

    // Show success message
    setSuccess(true);

    // Clear form
    setFormData({
      name: '',
      email: '',
      password: '',
    });

    // Hide success after 3 seconds
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">📝 Create Your Account</h2>
      {success && (
        <div className="alert alert-success text-center" role="alert">
          Account created successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-dark w-100">Create Account</button>
      </form>
    </div>
  );
};

export default CreateAccount;