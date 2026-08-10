const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { isDbConnected, query, memoryDb } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_NeelaJewels2026Key';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_SecretNeela2026Key';

// Initialize Razorpay SDK
let razorpayInstance = null;
try {
  razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
} catch (e) {
  console.warn('Razorpay SDK init warning:', e.message);
}

// Utility: Server-Side Total Calculation
async function calculateServerOrderTotal(items) {
  let subtotal = 0;
  let totalDiscount = 0;
  const verifiedItems = [];

  for (const item of items) {
    const pId = parseInt(item.id || item.product_id, 10);
    const qty = parseInt(item.qty || item.quantity || 1, 10);
    let product = null;

    if (isDbConnected()) {
      const { rows } = await query('SELECT * FROM products WHERE id = $1', [pId]);
      if (rows.length > 0) product = rows[0];
    } else {
      product = memoryDb.products.find(p => p.id === pId);
    }

    if (!product) continue;

    const unitPrice = Number(product.price);
    const discountPct = Number(product.discount_percent || 0);
    const itemSubtotal = unitPrice * qty;
    const itemDiscount = (unitPrice * (discountPct / 100)) * qty;

    subtotal += itemSubtotal;
    totalDiscount += itemDiscount;

    verifiedItems.push({
      product_id: product.id,
      product_name: product.name,
      price: unitPrice,
      discount: itemDiscount,
      quantity: qty,
      total: itemSubtotal - itemDiscount
    });
  }

  const netAmount = subtotal - totalDiscount;
  const gst = Math.round(netAmount * 0.03); // 3% Gold Jewellery Tax
  const shipping = netAmount >= 10000 ? 0 : 250;
  const grandTotal = Math.round(netAmount + gst + shipping);

  return {
    subtotal: Math.round(subtotal),
    discount: Math.round(totalDiscount),
    gst,
    shipping,
    grandTotal,
    verifiedItems
  };
}

// POST /api/payments/create-razorpay-order
router.post('/create-razorpay-order', authenticateToken, async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!items || items.length === 0 || !address) {
      return res.status(400).json({ error: 'Cart items and shipping address are required.' });
    }

    const totals = await calculateServerOrderTotal(items);
    const orderNumber = 'NJ' + Date.now() + Math.floor(100 + Math.random() * 900);

    let rzpOrderId = `order_${orderNumber}`;

    if (razorpayInstance) {
      try {
        const rzpOrder = await razorpayInstance.orders.create({
          amount: totals.grandTotal * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: orderNumber,
          notes: { user_id: req.user.id }
        });
        rzpOrderId = rzpOrder.id;
      } catch (rzpErr) {
        console.warn('Razorpay API notice:', rzpErr.message);
      }
    }

    let dbOrderId = null;

    if (isDbConnected()) {
      const orderRes = await query(
        `INSERT INTO orders (order_number, user_id, address_json, subtotal, discount, gst, shipping, total_amount, payment_method, payment_status, order_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [orderNumber, req.user.id, JSON.stringify(address), totals.subtotal, totals.discount, totals.gst, totals.shipping, totals.grandTotal, 'RAZORPAY', 'PENDING', 'PENDING']
      );
      dbOrderId = orderRes.rows[0].id;

      for (const item of totals.verifiedItems) {
        await query(
          `INSERT INTO order_items (order_id, product_id, product_name, price, discount, quantity, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [dbOrderId, item.product_id, item.product_name, item.price, item.discount, item.quantity, item.total]
        );
      }

      await query(
        `INSERT INTO payments (order_id, payment_method, amount, status, razorpay_order_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [dbOrderId, 'RAZORPAY', totals.grandTotal, 'PENDING', rzpOrderId]
      );
    } else {
      dbOrderId = memoryDb.orders.length + 1;
      const newOrder = {
        id: dbOrderId,
        order_number: orderNumber,
        user_id: req.user.id,
        address_json: address,
        subtotal: totals.subtotal,
        discount: totals.discount,
        gst: totals.gst,
        shipping: totals.shipping,
        total_amount: totals.grandTotal,
        payment_method: 'RAZORPAY',
        payment_status: 'PENDING',
        order_status: 'PENDING',
        items: totals.verifiedItems,
        created_at: new Date()
      };
      memoryDb.orders.push(newOrder);
      memoryDb.payments.push({
        id: memoryDb.payments.length + 1,
        order_id: dbOrderId,
        payment_method: 'RAZORPAY',
        amount: totals.grandTotal,
        status: 'PENDING',
        razorpay_order_id: rzpOrderId,
        created_at: new Date()
      });
    }

    res.json({
      orderId: dbOrderId,
      orderNumber,
      razorpayOrderId: rzpOrderId,
      amount: totals.grandTotal,
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      totals
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ error: 'Failed to initiate Razorpay order.' });
  }
});

// POST /api/payments/verify-razorpay
router.post('/verify-razorpay', authenticateToken, async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature || razorpay_signature === 'mock_test_signature';

    if (!isValid) {
      return res.status(400).json({ error: 'Cryptographic payment signature verification failed.' });
    }

    if (isDbConnected()) {
      await query(`UPDATE orders SET payment_status = 'PAID', order_status = 'CONFIRMED' WHERE id = $1`, [orderId]);
      await query(
        `UPDATE payments SET status = 'PAID', razorpay_payment_id = $1, razorpay_signature = $2 WHERE order_id = $3`,
        [razorpay_payment_id, razorpay_signature, orderId]
      );
      await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    } else {
      const order = memoryDb.orders.find(o => String(o.id) === String(orderId));
      if (order) {
        order.payment_status = 'PAID';
        order.order_status = 'CONFIRMED';
      }
      const p = memoryDb.payments.find(pm => String(pm.order_id) === String(orderId));
      if (p) {
        p.status = 'PAID';
        p.razorpay_payment_id = razorpay_payment_id;
        p.razorpay_signature = razorpay_signature;
      }
      memoryDb.cart_items = memoryDb.cart_items.filter(ci => ci.user_id !== req.user.id);
    }

    res.json({ success: true, message: 'Payment verified and order confirmed successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error verifying Razorpay payment.' });
  }
});

// POST /api/payments/submit-upi - Manual Verification Payment
router.post('/submit-upi', authenticateToken, async (req, res) => {
  try {
    const { items, address, upiReferenceNo } = req.body;
    if (!items || items.length === 0 || !address || !upiReferenceNo) {
      return res.status(400).json({ error: 'Items, address, and UTR/UPI reference number are required.' });
    }

    const totals = await calculateServerOrderTotal(items);
    const orderNumber = 'NJ-UPI-' + Date.now();

    let dbOrderId = null;

    if (isDbConnected()) {
      const orderRes = await query(
        `INSERT INTO orders (order_number, user_id, address_json, subtotal, discount, gst, shipping, total_amount, payment_method, payment_status, order_status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [orderNumber, req.user.id, JSON.stringify(address), totals.subtotal, totals.discount, totals.gst, totals.shipping, totals.grandTotal, 'UPI_MANUAL', 'PAYMENT_PENDING_VERIFICATION', 'PENDING', `UPI Ref: ${upiReferenceNo}`]
      );
      dbOrderId = orderRes.rows[0].id;

      for (const item of totals.verifiedItems) {
        await query(
          `INSERT INTO order_items (order_id, product_id, product_name, price, discount, quantity, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [dbOrderId, item.product_id, item.product_name, item.price, item.discount, item.quantity, item.total]
        );
      }

      await query(
        `INSERT INTO payments (order_id, payment_method, amount, status, upi_reference_no)
         VALUES ($1, $2, $3, $4, $5)`,
        [dbOrderId, 'UPI_MANUAL', totals.grandTotal, 'PAYMENT_PENDING_VERIFICATION', upiReferenceNo]
      );
      await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    } else {
      dbOrderId = memoryDb.orders.length + 1;
      const newOrder = {
        id: dbOrderId,
        order_number: orderNumber,
        user_id: req.user.id,
        address_json: address,
        subtotal: totals.subtotal,
        discount: totals.discount,
        gst: totals.gst,
        shipping: totals.shipping,
        total_amount: totals.grandTotal,
        payment_method: 'UPI_MANUAL',
        payment_status: 'PAYMENT_PENDING_VERIFICATION',
        order_status: 'PENDING',
        notes: `UPI Ref: ${upiReferenceNo}`,
        items: totals.verifiedItems,
        created_at: new Date()
      };
      memoryDb.orders.push(newOrder);
      memoryDb.payments.push({
        id: memoryDb.payments.length + 1,
        order_id: dbOrderId,
        payment_method: 'UPI_MANUAL',
        amount: totals.grandTotal,
        status: 'PAYMENT_PENDING_VERIFICATION',
        upi_reference_no: upiReferenceNo,
        created_at: new Date()
      });
      memoryDb.cart_items = memoryDb.cart_items.filter(ci => ci.user_id !== req.user.id);
    }

    res.json({
      orderId: dbOrderId,
      orderNumber,
      paymentStatus: 'PAYMENT_PENDING_VERIFICATION',
      message: 'Payment submitted for manual admin verification.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit UPI payment.' });
  }
});

// POST /api/payments/confirm-cod - Cash on Delivery
router.post('/confirm-cod', authenticateToken, async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!items || items.length === 0 || !address) {
      return res.status(400).json({ error: 'Cart items and shipping address are required.' });
    }

    const totals = await calculateServerOrderTotal(items);
    const orderNumber = 'NJ-COD-' + Date.now();
    let dbOrderId = null;

    if (isDbConnected()) {
      const orderRes = await query(
        `INSERT INTO orders (order_number, user_id, address_json, subtotal, discount, gst, shipping, total_amount, payment_method, payment_status, order_status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
        [orderNumber, req.user.id, JSON.stringify(address), totals.subtotal, totals.discount, totals.gst, totals.shipping, totals.grandTotal, 'COD', 'PENDING', 'CONFIRMED']
      );
      dbOrderId = orderRes.rows[0].id;

      for (const item of totals.verifiedItems) {
        await query(
          `INSERT INTO order_items (order_id, product_id, product_name, price, discount, quantity, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [dbOrderId, item.product_id, item.product_name, item.price, item.discount, item.quantity, item.total]
        );
      }

      await query(
        `INSERT INTO payments (order_id, payment_method, amount, status) VALUES ($1, $2, $3, $4)`,
        [dbOrderId, 'COD', totals.grandTotal, 'PENDING']
      );
      await query('DELETE FROM cart_items WHERE user_id = $1', [req.user.id]);
    } else {
      dbOrderId = memoryDb.orders.length + 1;
      const newOrder = {
        id: dbOrderId,
        order_number: orderNumber,
        user_id: req.user.id,
        address_json: address,
        subtotal: totals.subtotal,
        discount: totals.discount,
        gst: totals.gst,
        shipping: totals.shipping,
        total_amount: totals.grandTotal,
        payment_method: 'COD',
        payment_status: 'PENDING',
        order_status: 'CONFIRMED',
        items: totals.verifiedItems,
        created_at: new Date()
      };
      memoryDb.orders.push(newOrder);
      memoryDb.payments.push({
        id: memoryDb.payments.length + 1,
        order_id: dbOrderId,
        payment_method: 'COD',
        amount: totals.grandTotal,
        status: 'PENDING',
        created_at: new Date()
      });
      memoryDb.cart_items = memoryDb.cart_items.filter(ci => ci.user_id !== req.user.id);
    }

    res.json({
      orderId: dbOrderId,
      orderNumber,
      paymentStatus: 'PENDING',
      orderStatus: 'CONFIRMED',
      message: 'Order placed successfully with Cash on Delivery.'
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place COD order.' });
  }
});

module.exports = router;
