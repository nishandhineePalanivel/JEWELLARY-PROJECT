import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, AlertTriangle, Clock } from 'lucide-react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(e => console.warn('Failed to load admin metrics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen max-w-7xl mx-auto px-4 py-20 text-center text-gold">Loading executive dashboard...</div>;
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 text-ivory space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-bold text-gold">Admin Portal</h1>
            <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-bold uppercase">Executive Panel</span>
          </div>
          <p className="text-xs text-ivory/60 mt-1">Real-time overview of revenue, stock levels, orders, and payment approvals.</p>
        </div>

        <div className="flex gap-2">
          <Link to="/admin/products" className="px-4 py-2 bg-ink/80 border border-gold/30 hover:border-gold text-gold text-xs font-semibold rounded-xl">
            Products Catalog
          </Link>
          <Link to="/admin/orders" className="px-4 py-2 bg-ink/80 border border-gold/30 hover:border-gold text-gold text-xs font-semibold rounded-xl">
            Order Queue
          </Link>
          <Link to="/admin/payments" className="px-4 py-2 bg-gradient-to-r from-gold to-amber-600 text-ink text-xs font-bold rounded-xl shadow-lg">
            Verify UPI ({data?.pendingPaymentsCount || 0})
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-ink/90 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-ivory/60 text-xs">
            <span>Total Revenue</span>
            <DollarSign className="w-5 h-5 text-gold" />
          </div>
          <span className="text-2xl font-bold text-gold block">₹{Number(data?.totalRevenue || 0).toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-emerald-400 font-medium">Verified Paid Orders</span>
        </div>

        <div className="bg-ink/90 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-ivory/60 text-xs">
            <span>Total Orders</span>
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <span className="text-2xl font-bold text-ivory block">{data?.totalOrders || 0}</span>
          <span className="text-[10px] text-gold font-medium">All Time Orders</span>
        </div>

        <div className="bg-ink/90 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-ivory/60 text-xs">
            <span>Registered Customers</span>
            <Users className="w-5 h-5 text-gold" />
          </div>
          <span className="text-2xl font-bold text-ivory block">{data?.totalCustomers || 0}</span>
          <span className="text-[10px] text-gold font-medium">Privilege Members</span>
        </div>

        <div className="bg-ink/90 border border-gold/30 rounded-2xl p-6 shadow-xl space-y-2">
          <div className="flex justify-between items-center text-ivory/60 text-xs">
            <span>Pending Payment Verification</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <span className="text-2xl font-bold text-purple-300 block">{data?.pendingPaymentsCount || 0}</span>
          <Link to="/admin/payments" className="text-[10px] text-purple-400 font-semibold hover:underline block">
            Requires Action →
          </Link>
        </div>
      </div>

      {/* Grid: Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Items Table */}
        <div className="bg-ink/80 border border-gold/20 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-gold/10 pb-3">
            <h3 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock Items Alert
            </h3>
            <Link to="/admin/products" className="text-xs text-gold hover:underline">Manage Stock</Link>
          </div>

          {(data?.lowStockProducts || []).length === 0 ? (
            <p className="text-xs text-ivory/50 italic py-4">All products are adequately stocked.</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((p) => (
                <div key={p.id} className="flex justify-between items-center text-xs p-3 bg-ink/60 border border-gold/10 rounded-xl">
                  <div>
                    <span className="font-semibold text-ivory block">{p.name}</span>
                    <span className="text-ivory/50 text-[10px]">{p.category} • {p.material}</span>
                  </div>
                  <span className="px-3 py-1 bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold rounded-lg text-xs">
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-ink/80 border border-gold/20 rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex justify-between items-center border-b border-gold/10 pb-3">
            <h3 className="text-base font-serif font-bold text-gold flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gold" /> Recent Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-gold hover:underline">View All Orders</Link>
          </div>

          {(data?.recentOrders || []).length === 0 ? (
            <p className="text-xs text-ivory/50 italic py-4">No recent orders.</p>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((o) => (
                <div key={o.id} className="flex justify-between items-center text-xs p-3 bg-ink/60 border border-gold/10 rounded-xl">
                  <div>
                    <span className="font-semibold text-gold block">#{o.order_number || o.id}</span>
                    <span className="text-ivory/60 text-[10px]">{o.customer_name || 'Customer'} • {o.payment_method}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-ivory block">₹{Number(o.total_amount).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{o.order_status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
