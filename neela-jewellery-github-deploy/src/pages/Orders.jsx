import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, Clock, FileText } from 'lucide-react';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data))
      .catch(e => console.warn('Failed to fetch user orders'))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status, type = 'order') => {
    const isPay = type === 'payment';
    const colors = {
      CONFIRMED: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      DELIVERED: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      PAID: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      PENDING: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      PAYMENT_PENDING_VERIFICATION: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      PROCESSING: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
      SHIPPED: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      FAILED: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
      CANCELLED: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
    };

    return (
      <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${colors[status] || 'bg-gold/10 text-gold border-gold/30'}`}>
        {status?.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-10 text-ivory">
      <div className="mb-8 border-b border-gold/20 pb-4">
        <h1 className="text-3xl font-serif font-bold text-gold">Order History</h1>
        <p className="text-xs text-ivory/60 mt-1">Track live status and download official tax invoices for your pieces.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-ink/60 border border-gold/20 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-ink/40 border border-gold/10 rounded-2xl p-8 space-y-4">
          <PackageCheck className="w-16 h-16 text-gold/60 mx-auto" />
          <h3 className="text-xl font-serif text-gold">No Orders Placed Yet</h3>
          <p className="text-xs text-ivory/60">Your journey of royal elegance begins here.</p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-gold text-ink font-bold text-xs rounded-xl">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-ink/80 border border-gold/20 hover:border-gold/50 rounded-2xl p-5 transition-all shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-serif font-bold text-base text-gold">#{order.order_number || order.id}</span>
                  {getStatusBadge(order.payment_status, 'payment')}
                  {getStatusBadge(order.order_status, 'order')}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-ivory/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}
                  </span>
                  <span>•</span>
                  <span>{order.items?.length || 1} item(s)</span>
                  <span>•</span>
                  <span className="font-semibold text-ivory">Payment: {order.payment_method}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gold/10 pt-3 sm:pt-0">
                <div className="text-right">
                  <span className="text-xs text-ivory/50 block">Grand Total</span>
                  <span className="text-lg font-bold text-gold">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="px-4 py-2 bg-gold/10 border border-gold/30 hover:bg-gold hover:text-ink text-gold font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
