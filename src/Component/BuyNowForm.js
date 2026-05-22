// src/Component/BuyNowForm.js

import React, { useState } from 'react';
import './Jewel.css';

const BuyNowForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    address: '',
    paymentMode: '',
    productName: '',
    price: '',
    quantity: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('✅ Order placed successfully!');
    setFormData({
      customerName: '',
      address: '',
      paymentMode: '',
      productName: '',
      price: '',
      quantity: ''
    });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">🛍️ Buy Now</h2>
      {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Customer Name</label>
          <input
            type="text"
            name="customerName"
            className="form-control"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Customer Address</label>
          <textarea
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Payment Mode</label>
          <select
            name="paymentMode"
            className="form-control"
            value={formData.paymentMode}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Payment Mode --</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            className="form-control"
            value={formData.productName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Price (₹)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group mb-4">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            className="form-control"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">Place Order</button>
      </form>
    </div>
  );
};

export default BuyNowForm;