import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/shop');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'customer') {
      setEmail('priya@example.com');
      setPassword('customer123');
    } else {
      setEmail('admin@neelajewellery.com');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center max-w-md mx-auto px-4 py-12 text-ivory">
      <div className="bg-ink/90 border border-gold/30 rounded-3xl p-8 w-full shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gold/10 border border-gold/40 rounded-full flex items-center justify-center mx-auto text-gold font-serif text-2xl font-bold">
            N
          </div>
          <h1 className="text-2xl font-serif text-gold font-bold">Welcome to Neela</h1>
          <p className="text-xs text-ivory/60">Sign in to access your saved heirlooms & orders</p>
        </div>

        {/* Demo Fast Fill Buttons */}
        <div className="bg-gold/10 border border-gold/20 rounded-xl p-3 space-y-2">
          <span className="text-[11px] text-gold font-semibold block text-center uppercase tracking-wider">⚡ Demo Credentials</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('customer')}
              className="py-1.5 px-2 bg-ink/80 border border-gold/30 hover:bg-gold hover:text-ink text-gold rounded-lg transition-all font-medium text-[11px]"
            >
              Fill Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin')}
              className="py-1.5 px-2 bg-ink/80 border border-amber-500/30 hover:bg-amber-500 hover:text-ink text-amber-300 rounded-lg transition-all font-medium text-[11px]"
            >
              Fill Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
                required
              />
              <User className="w-4 h-4 text-gold/60 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
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
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-ivory/60 border-t border-gold/10 pt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold font-semibold hover:underline">
            Register Account
          </Link>
        </div>
      </div>
    </div>
  );
}
