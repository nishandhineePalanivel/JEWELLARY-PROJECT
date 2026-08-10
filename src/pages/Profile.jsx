import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, PackageCheck, Heart, Plus, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function Profile() {
  const { user, addresses, addAddress } = useAuth();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const [newAddr, setNewAddr] = useState({
    full_name: user?.name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false
  });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddr);
      setShowAddressForm(false);
      setToastMsg('Address added successfully!');
    } catch (err) {
      setToastMsg('Failed to save address.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-10 text-ivory space-y-8">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      {/* Header card */}
      <div className="bg-gradient-to-r from-amber-950/60 via-ink to-amber-950/60 border border-gold/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gold text-ink font-serif font-bold text-2xl flex items-center justify-center shadow-xl uppercase">
            {user.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-gold">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-ivory/60 mt-0.5">{user.email} • {user.phone || 'No phone'}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 bg-ink/80 border border-gold/30 hover:border-gold text-gold text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <PackageCheck className="w-4 h-4" /> My Orders
          </Link>

          <Link
            to="/wishlist"
            className="px-4 py-2 bg-ink/80 border border-gold/30 hover:border-gold text-gold text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all"
          >
            <Heart className="w-4 h-4" /> Saved Wishlist
          </Link>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-ink/80 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-gold/20 pb-4">
          <h2 className="text-xl font-serif font-bold text-gold flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Saved Shipping Addresses
          </h2>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="px-4 py-2 bg-gold/10 border border-gold/30 hover:bg-gold hover:text-ink text-gold text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>

        {showAddressForm && (
          <form onSubmit={handleAddAddress} className="p-4 bg-ink border border-gold/20 rounded-xl space-y-4">
            <h3 className="text-xs font-semibold text-gold uppercase tracking-wider">New Shipping Address</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                value={newAddr.full_name}
                onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })}
                className="p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
                required
              />
              <input
                type="text"
                placeholder="Phone Number *"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Address Line 1 *"
              value={newAddr.address_line1}
              onChange={(e) => setNewAddr({ ...newAddr, address_line1: e.target.value })}
              className="w-full p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
              required
            />
            <input
              type="text"
              placeholder="Address Line 2 (Optional)"
              value={newAddr.address_line2}
              onChange={(e) => setNewAddr({ ...newAddr, address_line2: e.target.value })}
              className="w-full p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
            />
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City *"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
                required
              />
              <input
                type="text"
                placeholder="State *"
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
                required
              />
              <input
                type="text"
                placeholder="Pincode *"
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="p-3 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-amber-400"
            >
              Save Address
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p className="text-xs text-ivory/50 italic">No saved addresses found. Add one for fast checkout.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 rounded-xl border border-gold/20 bg-ink/60 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-gold">{addr.full_name}</span>
                  {addr.is_default && <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">DEFAULT</span>}
                </div>
                <p className="text-xs text-ivory/80 leading-relaxed">
                  {addr.address_line1}, {addr.address_line2 ? `${addr.address_line2}, ` : ''}
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <span className="text-[11px] text-ivory/50 block">Phone: {addr.phone}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
