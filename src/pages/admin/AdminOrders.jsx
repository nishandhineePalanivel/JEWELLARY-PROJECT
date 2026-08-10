import React, { useState, useEffect } from 'react';
import { Download, Search } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const fetchAdminOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/orders');
      setOrders(res.data);
    } catch (e) {
      console.warn('Failed to load admin orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { order_status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
      setToastMsg(`Order status updated to "${newStatus}"`);
    } catch (e) {
      setToastMsg('Failed to update order status.');
    }
  };

  const handleDownloadInvoice = async (order) => {
    try {
      const response = await api.get(`/orders/${order.id}/invoice`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Neela_Invoice_${order.order_number || order.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert('Failed to download invoice PDF.');
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.order_number?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (o.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (o.payment_method?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 text-ivory space-y-8">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gold">Order Fulfillment Queue</h1>
          <p className="text-xs text-ivory/60 mt-1">Track customer shipments, update dispatch milestones, and download invoices.</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by Order ID or Customer Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 pl-3 pr-10 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
        />
        <Search className="w-4 h-4 text-gold absolute right-3 top-3" />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gold">Loading order queue...</div>
      ) : (
        <div className="bg-ink/90 border border-gold/30 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ivory/80">
              <thead className="bg-gold/10 text-gold uppercase tracking-wider text-[10px] font-bold border-b border-gold/20">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Amount (₹)</th>
                  <th className="p-4">Fulfillment Status</th>
                  <th className="p-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gold/5 transition-colors">
                    <td className="p-4 font-bold text-gold font-mono">#{o.order_number || o.id}</td>
                    <td className="p-4">
                      <span className="font-semibold text-ivory block">{o.customer_name || 'Customer'}</span>
                      <span className="text-[10px] text-ivory/50">{o.customer_email || ''}</span>
                    </td>
                    <td className="p-4 text-ivory/60">
                      {new Date(o.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold block">{o.payment_method}</span>
                      <span className={`text-[10px] font-bold ${o.payment_status === 'PAID' ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {o.payment_status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-gold">₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <select
                        value={o.order_status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="bg-ink border border-gold/30 rounded-lg px-2 py-1 text-xs text-ivory font-semibold focus:outline-none focus:border-gold"
                      >
                        {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(o)}
                        className="p-1.5 bg-gold/10 border border-gold/30 hover:bg-gold hover:text-ink text-gold rounded-lg text-xs font-semibold inline-flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
