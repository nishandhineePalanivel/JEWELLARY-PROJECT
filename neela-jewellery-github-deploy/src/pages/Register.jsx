import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, phone);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center max-w-md mx-auto px-4 py-12 text-ivory">
      <div className="bg-ink/90 border border-gold/30 rounded-3xl p-8 w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gold/10 border border-gold/40 rounded-full flex items-center justify-center mx-auto text-gold font-serif text-2xl font-bold">
            N
          </div>
          <h1 className="text-2xl font-serif text-gold font-bold">Join Neela Privilege</h1>
          <p className="text-xs text-ivory/60">Create an account for personalized jewelry experiences</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                required
              />
              <User className="w-4 h-4 text-gold/60 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                placeholder="priya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                required
              />
              <Mail className="w-4 h-4 text-gold/60 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                placeholder="+91 9812345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
              />
              <Phone className="w-4 h-4 text-gold/60 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">Password *</label>
            <div className="relative">
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                required
              />
              <Lock className="w-4 h-4 text-gold/60 absolute left-3 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-bold text-sm rounded-xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-ivory/60 border-t border-gold/10 pt-4">
          Already registered?{' '}
          <Link to="/login" className="text-gold font-semibold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
