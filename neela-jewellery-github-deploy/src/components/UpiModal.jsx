import React, { useState } from 'react';
import { X, QrCode, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export default function UpiModal({ isOpen, onClose, totalAmount, onSubmitUpi, loading }) {
  const [upiRef, setUpiRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const upiId = 'neela.jewellery@upi';

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!upiRef.trim()) {
      setError('Please enter your 12-digit UPI UTR / Transaction Reference number.');
      return;
    }
    setError('');
    onSubmitUpi(upiRef.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-ink border border-gold/30 rounded-2xl w-full max-w-md p-6 text-ivory shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ivory/60 hover:text-ivory hover:bg-gold/10 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-gold/30">
            <QrCode className="w-6 h-6 text-gold" />
          </div>
          <h2 className="text-xl font-serif text-gold">UPI / Bank Transfer Payment</h2>
          <p className="text-xs text-ivory/60 mt-1">Manual Verification Method</p>
        </div>

        <div className="bg-ink/80 border border-gold/20 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between items-center text-sm border-b border-gold/10 pb-2">
            <span className="text-ivory/70">Total Amount to Pay:</span>
            <span className="text-lg font-bold text-gold">₹{Number(totalAmount).toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-ivory/70">UPI ID:</span>
            <div className="flex items-center gap-2 font-mono text-gold bg-gold/10 px-2.5 py-1 rounded-lg">
              <span>{upiId}</span>
              <button onClick={handleCopy} className="hover:text-white">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-ivory/60 border-t border-gold/10 pt-2 space-y-1">
            <p><strong>Bank:</strong> HDFC Bank (Indiranagar Branch)</p>
            <p><strong>A/C No:</strong> 918237465012 | <strong>IFSC:</strong> HDFC0001234</p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl mb-6 shadow-inner">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${upiId}%26pn=NeelaJewellery%26am=${totalAmount}%26cu=INR`}
            alt="UPI Payment QR Code"
            className="w-44 h-44 object-contain"
          />
          <span className="text-[11px] font-medium text-slate-700 mt-2">Scan with GPay, PhonePe, Paytm, or BHIM</span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-ivory/80 mb-1 font-medium">
              Enter 12-Digit UPI Transaction / UTR Reference No:
            </label>
            <input
              type="text"
              placeholder="e.g. 423189056123"
              value={upiRef}
              onChange={(e) => setUpiRef(e.target.value)}
              className="w-full px-4 py-2.5 bg-ink/90 border border-gold/30 rounded-xl text-ivory placeholder-ivory/30 focus:outline-none focus:border-gold font-mono text-sm"
              required
            />
          </div>

          <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 flex gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>Your order will be set to <strong>PAYMENT_PENDING_VERIFICATION</strong> until our accounts team verifies your transfer.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-gold to-amber-600 hover:from-amber-500 hover:to-gold text-ink font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting Payment...' : 'I Have Completed Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}
