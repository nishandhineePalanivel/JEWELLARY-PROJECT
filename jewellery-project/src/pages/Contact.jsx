import React, { useState } from 'react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
      <h1 className="font-display text-4xl text-ivory mb-6">Contact</h1>
      <p className="text-ivory/60 mb-10">
        Questions about an order, custom design, or a repair — write to us below.
      </p>

      {sent ? (
        <p className="text-gold font-display text-xl">
          Message sent. We reply within one business day.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest text-ivory/60 mb-2">Name</label>
            <input
              required
              type="text"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ivory/60 mb-2">Email</label>
            <input
              required
              type="email"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-ivory/60 mb-2">Message</label>
            <textarea
              required
              rows={5}
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-ivory focus:border-gold outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-gold text-ink px-8 py-3 text-sm uppercase tracking-widest hover:bg-goldbright transition-colors"
          >
            Send message
          </button>
        </form>
      )}
    </div>
  );
}
