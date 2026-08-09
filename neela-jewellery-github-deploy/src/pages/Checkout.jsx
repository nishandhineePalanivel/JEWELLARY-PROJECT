import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, QrCode, Banknote, Check, ArrowRight, MapPin, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import UpiModal from '../components/UpiModal';
import Toast from '../components/Toast';
import api from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, discount, gst, shipping, total, clearCart } = useCart();
  const { user, addresses, addAddress } = useAuth();

  const [selectedAddress, setSelectedAddress] = useState(addresses[0] || null);
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY'); // 'RAZORPAY', 'UPI_MANUAL', 'COD'
  
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // New Address Form State
  const [newAddr, setNewAddr] = useState({
    full_name: user?.name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: true
  });

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    try {
      const saved = await addAddress(newAddr);
      setSelectedAddress(saved);
      setShowAddressForm(false);
      setToastMsg('Shipping address saved!');
    } catch (err) {
      setToastMsg('Failed to save shipping address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setToastMsg('Please select or add a valid shipping address.');
      return;
    }

    if (items.length === 0) {
      setToastMsg('Your cart is empty.');
      return;
    }

    if (paymentMethod === 'UPI_MANUAL') {
      setShowUpiModal(true);
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'RAZORPAY') {
        // Step 1: Request order creation from backend
        const res = await api.post('/payments/create-razorpay-order', {
          items,
          address: selectedAddress
        });

        const { orderId, orderNumber, razorpayOrderId, amount, key } = res.data;

        // Step 2: Trigger Razorpay Checkout Modal
        const options = {
          key: key || 'rzp_test_NeelaJewels2026Key',
          amount: amount * 100,
          currency: 'INR',
          name: 'Neela Jewellery',
          description: `Order #${orderNumber}`,
          order_id: razorpayOrderId,
          handler: async function (response) {
            try {
              // Cryptographic verification on backend
              const verifyRes = await api.post('/payments/verify-razorpay', {
                orderId,
                razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpay_signature: response.razorpay_signature || 'mock_test_signature'
              });

              if (verifyRes.data.success) {
                clearCart();
                navigate(`/orders/${orderId}`);
              }
            } catch (err) {
              setToastMsg('Payment verification failed server-side.');
            }
          },
          prefill: {
            name: selectedAddress.full_name,
            email: user?.email || 'customer@neelajewellery.com',
            contact: selectedAddress.phone
          },
          theme: { color: '#B8860B' }
        };

        if (window.Razorpay) {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // Test Mode Simulation fallback if script is loading
          const confirmPayment = window.confirm(
            `Razorpay TEST MODE\nSimulate successful payment for ₹${amount.toLocaleString('en-IN')}?`
          );
          if (confirmPayment) {
            const verifyRes = await api.post('/payments/verify-razorpay', {
              orderId,
              razorpay_order_id: razorpayOrderId,
              razorpay_payment_id: `pay_${Date.now()}`,
              razorpay_signature: 'mock_test_signature'
            });
            if (verifyRes.data.success) {
              clearCart();
              navigate(`/orders/${orderId}`);
            }
          }
        }
      } else if (paymentMethod === 'COD') {
        const res = await api.post('/payments/confirm-cod', {
          items,
          address: selectedAddress
        });
        clearCart();
        navigate(`/orders/${res.data.orderId}`);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setToastMsg('Failed to process checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpiSubmit = async (upiRef) => {
    setLoading(true);
    try {
      const res = await api.post('/payments/submit-upi', {
        items,
        address: selectedAddress,
        upiReferenceNo: upiRef
      });
      setShowUpiModal(false);
      clearCart();
      navigate(`/orders/${res.data.orderId}`);
    } catch (err) {
      setToastMsg('Failed to submit UPI payment reference.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 text-ivory">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <h1 className="text-3xl font-serif font-bold text-gold mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns: Address & Payment Method */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: Shipping Address */}
          <div className="bg-ink/80 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gold/20 pb-3">
              <h2 className="text-xl font-serif font-bold text-gold flex items-center gap-2">
                <MapPin className="w-5 h-5" /> 1. Shipping Address
              </h2>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add New Address
                </button>
              )}
            </div>

            {!showAddressForm && addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddress?.id === addr.id
                        ? 'border-gold bg-gold/10 text-ivory shadow-md'
                        : 'border-gold/20 bg-ink hover:border-gold/50 text-ivory/70'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm text-gold">{addr.full_name}</span>
                      {selectedAddress?.id === addr.id && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-ivory/80 leading-relaxed">
                      {addr.address_line1}, {addr.address_line2 ? `${addr.address_line2}, ` : ''}
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <span className="text-[11px] text-ivory/50 block mt-2">Phone: {addr.phone}</span>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSaveNewAddress} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={newAddr.full_name}
                    onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })}
                    className="p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phone Number *"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Address Line 1 *"
                  value={newAddr.address_line1}
                  onChange={(e) => setNewAddr({ ...newAddr, address_line1: e.target.value })}
                  className="w-full p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                  required
                />
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={newAddr.address_line2}
                  onChange={(e) => setNewAddr({ ...newAddr, address_line2: e.target.value })}
                  className="w-full p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                />
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    className="p-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-amber-400 transition-all"
                >
                  Save Address & Proceed
                </button>
              </form>
            )}
          </div>

          {/* STEP 2: Payment Method */}
          <div className="bg-ink/80 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-serif font-bold text-gold border-b border-gold/20 pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> 2. Select Payment Option
            </h2>

            <div className="space-y-3">
              {/* Option 1: Razorpay */}
              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-gold bg-gold/10 text-ivory'
                    : 'border-gold/20 bg-ink text-ivory/70 hover:border-gold/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gold">Razorpay Online Gateway (TEST MODE)</h4>
                    <p className="text-[11px] text-ivory/60">UPI, Debit/Credit Card, NetBanking, Wallets with instant cryptographic signature check.</p>
                  </div>
                </div>
                {paymentMethod === 'RAZORPAY' && <Check className="w-5 h-5 text-emerald-400" />}
              </div>

              {/* Option 2: UPI Manual */}
              <div
                onClick={() => setPaymentMethod('UPI_MANUAL')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'UPI_MANUAL'
                    ? 'border-gold bg-gold/10 text-ivory'
                    : 'border-gold/20 bg-ink text-ivory/70 hover:border-gold/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gold">UPI / Bank Transfer (Manual Verification)</h4>
                    <p className="text-[11px] text-ivory/60">Scan QR Code or copy UPI ID/Bank Details. Order verified manually by Admin team.</p>
                  </div>
                </div>
                {paymentMethod === 'UPI_MANUAL' && <Check className="w-5 h-5 text-emerald-400" />}
              </div>

              {/* Option 3: COD */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  paymentMethod === 'COD'
                    ? 'border-gold bg-gold/10 text-ivory'
                    : 'border-gold/20 bg-ink text-ivory/70 hover:border-gold/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gold">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-ivory/60">Pay cash upon delivery. Verified via OTP confirmation before dispatch.</p>
                  </div>
                </div>
                {paymentMethod === 'COD' && <Check className="w-5 h-5 text-emerald-400" />}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="bg-ink/90 border border-gold/30 rounded-2xl p-6 h-fit space-y-6 shadow-2xl">
          <h2 className="text-xl font-serif font-bold text-gold border-b border-gold/20 pb-3">Items Breakdown</h2>

          <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-medium text-ivory line-clamp-1">{item.name}</p>
                  <span className="text-ivory/50 text-[10px]">Qty: {item.qty}</span>
                </div>
                <span className="font-semibold text-gold">
                  ₹{(Number(item.price) * item.qty).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gold/20 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-ivory/70">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-ivory/70">
              <span>GST (3%)</span>
              <span>₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-ivory/70">
              <span>Shipping</span>
              <span className="text-emerald-400">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>

            <div className="border-t border-gold/20 pt-3 flex justify-between text-lg font-bold text-gold">
              <span>Final Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-bold text-base rounded-xl shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Processing Order...' : 'Confirm & Place Order'} <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-ivory/60 justify-center">
            <ShieldCheck className="w-4 h-4 text-gold" />
            <span>100% Insured Delivery & Hallmark Guarantee</span>
          </div>
        </div>
      </div>

      {/* Manual UPI Modal */}
      <UpiModal
        isOpen={showUpiModal}
        onClose={() => setShowUpiModal(false)}
        totalAmount={total}
        onSubmitUpi={handleUpiSubmit}
        loading={loading}
      />
    </div>
  );
}
