import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, QrCode } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetchAdminPayments();
  }, []);

  const fetchAdminPayments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data);
    } catch (e) {
      console.warn('Failed to load admin payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (paymentId, status) => {
    const actionText = status === 'PAID' ? 'Approve' : 'Reject';
    if (window.confirm(`Are you sure you want to ${actionText} this payment?`)) {
      try {
        await api.post(`/admin/payments/${paymentId}/verify`, {
          status,
          adminNotes: `Verified by Admin on ${new Date().toLocaleString()}`
        });
        setToastMsg(`Payment ${actionText}d successfully!`);
        fetchAdminPayments();
      } catch (e) {
        setToastMsg('Failed to verify payment.');
      }
    }
  };

  const pendingVerificationList = payments.filter(p => p.status === 'PAYMENT_PENDING_VERIFICATION');

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 text-ivory space-y-8">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-serif font-bold text-gold">Manual Payment Verification</h1>
            {pendingVerificationList.length > 0 && (
              <span className="px-2.5 py-0.5 bg-purple-950 text-purple-300 border border-purple-500/40 rounded-full text-xs font-bold animate-pulse">
                {pendingVerificationList.length} Action Needed
              </span>
            )}
          </div>
          <p className="text-xs text-ivory/60 mt-1">Review UTR / Bank Transfer reference numbers submitted by customers and verify payments.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gold">Loading payment records...</div>
      ) : (
        <div className="space-y-6">
          {/* Pending Verification Section */}
          <div className="bg-ink/90 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-purple-300 flex items-center gap-2">
              <QrCode className="w-5 h-5" /> Pending Verification Queue ({pendingVerificationList.length})
            </h2>

            {pendingVerificationList.length === 0 ? (
              <p className="text-xs text-ivory/50 italic py-4">No pending manual UPI payments requiring verification.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingVerificationList.map((pm) => (
                  <div key={pm.id} className="p-4 bg-ink border border-purple-500/30 rounded-xl space-y-3 shadow-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-serif font-bold text-gold text-base">#{pm.order_number}</span>
                        <span className="text-xs text-ivory/60 block">{pm.customer_name || 'Customer'}</span>
                      </div>
                      <span className="text-lg font-bold text-gold">₹{Number(pm.amount).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-lg text-xs space-y-1 font-mono">
                      <p><strong className="text-purple-300">Method:</strong> {pm.payment_method}</p>
                      <p><strong className="text-purple-300">UTR / UPI Ref:</strong> <span className="text-gold font-bold">{pm.upi_reference_no || 'N/A'}</span></p>
                      <p className="text-[10px] text-ivory/50">Submitted: {new Date(pm.created_at || Date.now()).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button
                        onClick={() => handleVerifyPayment(pm.id, 'PAID')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Payment
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(pm.id, 'FAILED')}
                        className="flex-1 py-2 bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-xs rounded-xl hover:bg-rose-900 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Payment Audit Logs */}
          <div className="bg-ink/80 border border-gold/20 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-serif font-bold text-gold">All Payment Transactions History</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-ivory/80">
                <thead className="bg-gold/10 text-gold uppercase tracking-wider text-[10px] font-bold border-b border-gold/20">
                  <tr>
                    <th className="p-3">Payment ID</th>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount (₹)</th>
                    <th className="p-3">Reference / Trans ID</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {payments.map((pm) => (
                    <tr key={pm.id} className="hover:bg-gold/5">
                      <td className="p-3 font-mono">PAY-{pm.id}</td>
                      <td className="p-3 font-bold text-gold font-mono">#{pm.order_number}</td>
                      <td className="p-3 font-semibold">{pm.payment_method}</td>
                      <td className="p-3 font-bold">₹{Number(pm.amount).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-mono text-ivory/70">{pm.upi_reference_no || pm.razorpay_payment_id || 'N/A'}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          pm.status === 'PAID' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' :
                          pm.status === 'PAYMENT_PENDING_VERIFICATION' ? 'bg-purple-950 text-purple-300 border border-purple-500/30' :
                          'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {pm.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
