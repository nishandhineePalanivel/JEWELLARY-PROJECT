import React, { useState } from 'react';
import './Jewel.css'; // optional: for shared styling

const SignIn = () => {
  const [formData, setFormData] = useState({
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

    console.log('User signed in:', formData);

    setSuccess(true);

    setFormData({
      email: '',
      password: '',
    });

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="text-center mb-4">🔐 Sign In to Your Account</h2>
      {success && (
        <div className="alert alert-success text-center" role="alert">
          Signed in successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light shadow">
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;