import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import api from '../../services/api';
import Toast from '../../components/Toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Rings',
    price: '',
    discount_percent: '0',
    material: '',
    weight_grams: '',
    stock: '10',
    description: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const fetchAdminProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/products');
      setProducts(res.data);
    } catch (e) {
      console.warn('Failed to fetch admin products');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, formData);
        setToastMsg('Product updated successfully!');
      } else {
        await api.post('/admin/products', formData);
        setToastMsg('New product created successfully!');
      }
      setShowAddModal(false);
      setEditingProduct(null);
      fetchAdminProducts();
    } catch (e) {
      setToastMsg('Failed to save product.');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        setToastMsg('Product deleted.');
        fetchAdminProducts();
      } catch (e) {
        setToastMsg('Failed to delete product.');
      }
    }
  };

  const handleQuickStockUpdate = async (product, newStock) => {
    try {
      await api.put(`/admin/products/${product.id}`, { stock: newStock });
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: newStock } : p));
      setToastMsg(`Stock updated to ${newStock} for "${product.name}"`);
    } catch (e) {
      setToastMsg('Failed to update stock.');
    }
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      discount_percent: p.discount_percent || 0,
      material: p.material || '',
      weight_grams: p.weight_grams || 0,
      stock: p.stock || 0,
      description: p.description || '',
      image_url: p.images?.[0]?.image_url || p.images?.[0] || p.image_url || '',
      is_featured: !!p.is_featured
    });
    setShowAddModal(true);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-10 text-ivory space-y-8">
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/20 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gold">Product Inventory</h1>
          <p className="text-xs text-ivory/60 mt-1">Manage catalog prices, stock availability, discounts, and product details.</p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '', category: 'Rings', price: '', discount_percent: '0',
              material: '', weight_grams: '', stock: '10', description: '', image_url: '', is_featured: false
            });
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 bg-gradient-to-r from-gold to-amber-600 text-ink font-bold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Piece
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter by name, category, or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-2.5 pl-3 pr-10 bg-ink border border-gold/30 rounded-xl text-xs text-ivory placeholder-ivory/40"
        />
        <Search className="w-4 h-4 text-gold absolute right-3 top-3" />
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-20 text-gold">Loading products...</div>
      ) : (
        <div className="bg-ink/90 border border-gold/30 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ivory/80">
              <thead className="bg-gold/10 text-gold uppercase tracking-wider text-[10px] font-bold border-b border-gold/20">
                <tr>
                  <th className="p-4">SKU / Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price (₹)</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Stock Count</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gold/5 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink border border-gold/20 flex-shrink-0 flex items-center justify-center">
                        {p.images?.[0]?.image_url || p.image_url ? (
                          <img src={p.images?.[0]?.image_url || p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gold font-bold">{p.category?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-ivory block line-clamp-1">{p.name}</span>
                        <span className="text-[10px] text-ivory/50 font-mono">{p.sku || `NJ-${p.id}`}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gold font-medium">{p.category}</td>
                    <td className="p-4 font-bold text-ivory">₹{Number(p.price).toLocaleString('en-IN')}</td>
                    <td className="p-4">{p.discount_percent ? `${p.discount_percent}%` : '0%'}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={p.stock}
                          onChange={(e) => handleQuickStockUpdate(p, parseInt(e.target.value || 0, 10))}
                          className="w-16 py-1 px-2 bg-ink border border-gold/30 rounded text-center text-xs font-bold text-gold"
                        />
                        <span className="text-[10px] text-ivory/50">pcs</span>
                      </div>
                    </td>
                    <td className="p-4">{p.is_featured ? '⭐ Yes' : 'No'}</td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditModal(p)} className="p-1.5 text-gold hover:bg-gold/10 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-ink border border-gold/40 rounded-3xl w-full max-w-xl p-6 text-ivory shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 p-2 text-ivory/60 hover:text-ivory">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-serif font-bold text-gold mb-6">
              {editingProduct ? 'Edit Piece Details' : 'Add New Jewellery Piece'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs text-ivory/80 mb-1">Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-ivory/80 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                  >
                    {['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Bangles', 'Pendants'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-ivory/80 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-ivory/80 mb-1">Discount %</label>
                  <input
                    type="number"
                    value={formData.discount_percent}
                    onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                    className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                  />
                </div>

                <div>
                  <label className="block text-xs text-ivory/80 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-ivory/80 mb-1">Weight (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight_grams}
                    onChange={(e) => setFormData({ ...formData, weight_grams: e.target.value })}
                    className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-ivory/80 mb-1">Material Details</label>
                <input
                  type="text"
                  placeholder="e.g. 22k Gold · Natural Zambian Ruby"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs text-ivory/80 mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                />
              </div>

              <div>
                <label className="block text-xs text-ivory/80 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-ink/90 border border-gold/30 rounded-xl text-xs text-ivory"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 border-gold text-gold"
                />
                <label htmlFor="featuredCheck" className="text-xs text-ivory/80 font-medium">Feature on Homepage Banner</label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold to-amber-600 text-ink font-bold text-sm rounded-xl shadow-xl hover:from-amber-500 hover:to-gold"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
