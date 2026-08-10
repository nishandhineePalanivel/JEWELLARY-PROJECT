import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  Search,
  RefreshCw
} from 'lucide-react';

import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import localProducts from '../data/products';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState(localProducts);
  const [toastMsg, setToastMsg] = useState('');

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'All'
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );

  const [sortOption, setSortOption] = useState('newest');

  const [maxPrice, setMaxPrice] = useState(100000);

  const categories = [
    'All',
    'Rings',
    'Necklaces',
    'Earrings',
    'Bracelets',
    'Bangles',
    'Pendants'
  ];

  // Update products whenever filters change
  useEffect(() => {
    let filtered = [...localProducts];

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        product => product.category === selectedCategory
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.material.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)
      );
    }

    // Price filter
    filtered = filtered.filter(
      product => Number(product.price) <= maxPrice
    );

    // Sorting
    if (sortOption === 'price-low') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === 'price-high') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortOption === 'rating') {
      filtered.sort(
        (a, b) => Number(b.rating || 4.8) - Number(a.rating || 4.8)
      );
    }

    setProducts(filtered);
  }, [selectedCategory, searchTerm, sortOption, maxPrice]);

  // Keep URL in sync
  useEffect(() => {
    const params = {};

    if (selectedCategory !== 'All') {
      params.category = selectedCategory;
    }

    if (searchTerm.trim()) {
      params.search = searchTerm;
    }

    setSearchParams(params, { replace: true });
  }, [selectedCategory, searchTerm, setSearchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchTerm('');
    setSortOption('newest');
    setMaxPrice(100000);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen">

      <Toast
        message={toastMsg}
        onClose={() => setToastMsg('')}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gold">
          Jewellery Catalog
        </h1>

        <p className="text-xs text-ivory/60 mt-1">
          Browse fine handcrafted 22k gold, certified solitaires,
          and royal gem collections.
        </p>
      </div>

      {/* Search & Filter Control Bar */}
      <div className="bg-ink/80 border border-gold/20 rounded-2xl p-4 mb-8 space-y-4">

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full md:w-80"
          >
            <input
              type="text"
              placeholder="Search by name, diamond, ruby..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-3 pr-9 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40 focus:outline-none focus:border-gold"
            />

            <button
              type="submit"
              className="absolute right-3 top-2.5 text-gold"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Sort & Reset */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">

            <div className="flex items-center gap-1.5 text-xs text-gold">
              <SlidersHorizontal className="w-4 h-4" />

              <span>Sort:</span>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-ink border border-gold/30 rounded-lg px-2.5 py-1.5 text-xs text-ivory focus:outline-none focus:border-gold"
              >
                <option value="newest">
                  Featured & Newest
                </option>

                <option value="price-low">
                  Price: Low to High
                </option>

                <option value="price-high">
                  Price: High to Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 bg-gold/10 border border-gold/30 text-gold hover:bg-gold/20 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>

          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">

          <span className="text-xs text-ivory/50 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-gold" />
            Categories:
          </span>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-gold text-ink font-bold shadow-md'
                  : 'bg-ink/60 border border-gold/20 text-ivory/80 hover:border-gold/50'
              }`}
            >
              {cat}
            </button>
          ))}

        </div>

      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-ivory/60 mb-4">

        <span>
          Showing {products.length} exquisite pieces
        </span>

        {selectedCategory !== 'All' && (
          <span className="text-gold font-medium">
            Category: {selectedCategory}
          </span>
        )}

      </div>

      {/* Product Grid */}
      {products.length === 0 ? (

        <div className="text-center py-20 bg-ink/40 border border-gold/10 rounded-2xl p-8 space-y-4">

          <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold font-serif text-2xl font-bold">
            NJ
          </div>

          <h3 className="text-xl font-serif text-gold">
            No Matching Pieces Found
          </h3>

          <p className="text-xs text-ivory/60 max-w-sm mx-auto">
            Try adjusting your search criteria or explore our
            featured solitaire collections.
          </p>

          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 bg-gold text-ink font-bold text-xs rounded-xl hover:bg-amber-400 transition-all"
          >
            Clear All Filters
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onToast={(msg) => setToastMsg(msg)}
            />
          ))}

        </div>

      )}

    </div>
  );
}