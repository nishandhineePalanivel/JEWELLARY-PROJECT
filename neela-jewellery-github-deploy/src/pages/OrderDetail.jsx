import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';
import api from '../services/api';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data))
      .catch(e => console.warn('Failed to fetch order detail'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      const response = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
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
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-center text-gold">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="min-h-screen max-w-4xl mx-auto px-4 py-20 text-center text-ivory space-y-4">
        <h2 className="text-2xl font-serif text-gold">Order Not Found</h2>
        <button onClick={() => navigate('/orders')} className="px-6 py-2.5 bg-gold text-ink font-bold text-xs rounded-xl">
          Return to Orders
        </button>
      </div>
    );
  }

  const address = typeof order.address_json === 'string' ? JSON.parse(order.address_json) : (order.address_json || {});
  const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStatusIdx = statuses.indexOf(order.order_status) !== -1 ? statuses.indexOf(order.order_status) : 1;

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 py-10 text-ivory space-y-8">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-4">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1.5 text-xs text-ivory/70 hover:text-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Order History
        </button>

        <button
          onClick={handleDownloadInvoice}
          disabled={downloading}
          className="px-5 py-2.5 bg-gradient-to-r from-gold to-amber-600 text-ink font-bold text-xs rounded-xl shadow-lg hover:from-amber-500 hover:to-gold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Generating PDF...' : 'Download Tax Invoice (PDF)'}
        </button>
      </div>

      {/* Order Header Summary */}
      <div className="bg-ink/90 border border-gold/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-ivory/50 block">Official Order Reference</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gold">#{order.order_number || order.id}</h1>
            <p className="text-xs text-ivory/60 mt-1">
              Placed on {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-2">
            <div className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-xl text-center">
              <span className="text-[10px] text-ivory/50 block uppercase">Payment Status</span>
              <span className="text-xs font-bold text-gold">{order.payment_status?.replace(/_/g, ' ')}</span>
            </div>
            <div className="px-3 py-1 bg-gold/10 border border-gold/30 rounded-xl text-center">
              <span className="text-[10px] text-ivory/50 block uppercase">Order Status</span>
              <span className="text-xs font-bold text-emerald-400">{order.order_status?.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        {/* Live Order Timeline */}
        <div className="pt-6 border-t border-gold/10">
          <h3 className="text-xs font-semibold text-gold uppercase tracking-widest mb-6">Delivery Progress</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center relative">
            {statuses.map((st, idx) => {
              const isPassed = idx <= currentStatusIdx;
              return (
                <div key={st} className="space-y-2">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isPassed ? 'bg-gold text-ink shadow-lg shadow-gold/20' : 'bg-ink border border-gold/20 text-ivory/30'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] block font-medium uppercase tracking-wider ${isPassed ? 'text-gold' : 'text-ivory/30'}`}>
                    {st.replace(/_/g, ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Delivery Address & Itemized Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping Address */}
        <div className="bg-ink/80 border border-gold/20 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="text-base font-serif font-bold text-gold flex items-center gap-2 border-b border-gold/10 pb-2">
            <MapPin className="w-4 h-4 text-gold" /> Delivery Address
          </h3>
          <div className="text-xs text-ivory/80 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-ivory text-sm">{address.full_name || 'Customer'}</p>
            <p>{address.address_line1}</p>
            {address.address_line2 && <p>{address.address_line2}</p>}
            <p>{address.city}, {address.state} - {address.pincode}</p>
            <p className="text-ivory/50 pt-1">Phone: {address.phone}</p>
            <p className="text-ivory/50">Method: {order.payment_method}</p>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="md:col-span-2 bg-ink/80 border border-gold/20 rounded-2xl p-6 space-y-4 shadow-lg">
          <h3 className="text-base font-serif font-bold text-gold border-b border-gold/10 pb-2">Purchased Items</h3>

          <div className="space-y-3">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs p-3 bg-ink/60 border border-gold/10 rounded-xl">
                <div>
                  <h4 className="font-semibold text-ivory">{item.product_name || item.name}</h4>
                  <span className="text-ivory/50">Qty: {item.quantity || 1} • Unit: ₹{Number(item.price).toLocaleString('en-IN')}</span>
                </div>
                <span className="font-bold text-gold text-sm">
                  ₹{Number(item.total || (Number(item.price) * (item.quantity || 1))).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gold/20 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-ivory/70">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal || 0).toLocaleString('en-IN')}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>- ₹{Number(order.discount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-ivory/70">
              <span>GST (3% Jewellery Tax)</span>
              <span>₹{Number(order.gst || 0).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-ivory/70">
              <span>Insured Shipping</span>
              <span>{Number(order.shipping) === 0 ? 'FREE' : `₹${Number(order.shipping).toLocaleString('en-IN')}`}</span>
            </div>
            <div className="border-t border-gold/20 pt-2 flex justify-between text-base font-bold text-gold">
              <span>Grand Total</span>
              <span>₹{Number(order.total_amount || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
