import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-ink/60 border border-gold/20 rounded-xl p-4 animate-pulse space-y-4">
      <div className="w-full h-56 bg-gold/10 rounded-lg"></div>
      <div className="h-4 bg-gold/20 rounded w-3/4"></div>
      <div className="h-3 bg-gold/10 rounded w-1/2"></div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-5 bg-gold/20 rounded w-1/3"></div>
        <div className="h-8 bg-gold/30 rounded-lg w-24"></div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
      <div className="w-full h-96 bg-gold/10 rounded-2xl"></div>
      <div className="space-y-6">
        <div className="h-8 bg-gold/20 rounded w-3/4"></div>
        <div className="h-4 bg-gold/10 rounded w-1/4"></div>
        <div className="h-6 bg-gold/30 rounded w-1/3"></div>
        <div className="h-20 bg-gold/10 rounded w-full"></div>
        <div className="h-12 bg-gold/30 rounded-xl w-full"></div>
      </div>
    </div>
  );
}
