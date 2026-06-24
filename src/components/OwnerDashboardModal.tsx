import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, AppLanguage, PromoCode } from '../types';
import Icon from './Icon';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const COLOR_PRESETS = [
  { nameId: 'Violet (Default)', nameEn: 'Violet (Default)', r: 139, g: 92, b: 246, hex: '#8b5cf6' },
  { nameId: 'Emerald Hijau', nameEn: 'Emerald Green', r: 16, g: 185, b: 129, hex: '#10b981' },
  { nameId: 'Crimson Merah', nameEn: 'Crimson Red', r: 239, g: 68, b: 68, hex: '#ef4444' },
  { nameId: 'Sunset Amber', nameEn: 'Sunset Amber', r: 245, g: 158, b: 11, hex: '#f59e0b' },
  { nameId: 'Ocean Biru', nameEn: 'Ocean Blue', r: 14, g: 165, b: 233, hex: '#0ea5e9' },
  { nameId: 'Hot Pink', nameEn: 'Hot Pink', r: 236, g: 72, b: 153, hex: '#ec4899' },
];

interface OwnerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  productsList: Product[];
  saveProductsList: (newList: Product[]) => void;
  customPromos: PromoCode[];
  saveCustomPromos: (newPromos: PromoCode[]) => void;
  isOwnerAuthenticated: boolean;
  setIsOwnerAuthenticated: (val: boolean) => void;
  allTestimonials: any[];
  saveAllTestimonials: (newList: any[]) => void;
  maxTestimonialsShown: number;
  saveMaxTestimonialsShown: (val: number) => void;
  minPurchaseQty: number;
  saveMinPurchaseQty: (val: number) => void;
  themeColor: { r: number; g: number; b: number };
  saveThemeColor: (color: { r: number; g: number; b: number }) => void;
}

export default function OwnerDashboardModal({
  isOpen,
  onClose,
  language,
  productsList,
  saveProductsList,
  customPromos,
  saveCustomPromos,
  isOwnerAuthenticated,
  setIsOwnerAuthenticated,
  allTestimonials,
  saveAllTestimonials,
  maxTestimonialsShown,
  saveMaxTestimonialsShown,
  minPurchaseQty,
  saveMinPurchaseQty,
  themeColor,
  saveThemeColor,
}: OwnerDashboardModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'promos' | 'testimonials' | 'settings'>('products');

  // New Promo form states
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscountAmount, setNewPromoDiscountAmount] = useState<number>(10000);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState('');

  // New Testimonial form states
  const [testiName, setTestiName] = useState('');
  const [testiRating, setTestiRating] = useState<number>(5);
  const [testiCommentId, setTestiCommentId] = useState('');
  const [testiCommentEn, setTestiCommentEn] = useState('');
  const [testiSuccessMsg, setTestiSuccessMsg] = useState('');

  // New Product form states
  const [prodNameId, setProdNameId] = useState('');
  const [prodNameEn, setProdNameEn] = useState('');
  const [prodTaglineId, setProdTaglineId] = useState('');
  const [prodTaglineEn, setProdTaglineEn] = useState('');
  const [prodDescId, setProdDescId] = useState('');
  const [prodDescEn, setProdDescEn] = useState('');
  const [prodCategory, setProdCategory] = useState<'gaming' | 'entertainment' | 'tools' | 'services'>('gaming');
  const [prodIconName, setProdIconName] = useState('Zap');
  const [prodBadge, setProdBadge] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(25000);
  const [prodHasTiers, setProdHasTiers] = useState(false);

  // Dynamic Tier Builder
  const [tierInputs, setTierInputs] = useState<{ name: string; price: number; badge?: string }[]>([
    { name: '1 Bulan / 1 Month', price: 15000, badge: 'Standard' },
    { name: 'Lifetime / Seumur Hidup', price: 40000, badge: 'Best Seller' }
  ]);

  // Features & Specs comma separated inputs
  const [prodFeaturesId, setProdFeaturesId] = useState('');
  const [prodFeaturesEn, setProdFeaturesEn] = useState('');
  const [platformSpec, setPlatformSpec] = useState('Android');
  const [versionSpec, setVersionSpec] = useState('Terbaru / Latest');
  const [sizeSpec, setSizeSpec] = useState('Bervariasi / Variable');
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Handle Auth login
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '161071') {
      setIsOwnerAuthenticated(true);
      setPasswordError('');
      setPasswordInput('');
    } else {
      setPasswordError(
        language === 'id' ? 'Password salah! Hubungi developer jika lupa.' : 'Incorrect password!'
      );
    }
  };

  // Stock status toggle
  const handleToggleStock = (productId: string) => {
    const updated = productsList.map((prod) => {
      if (prod.id === productId) {
        return { ...prod, isOutOfStock: !prod.isOutOfStock };
      }
      return prod;
    });
    saveProductsList(updated);
  };

  // Edit base product price
  const handleUpdatePrice = (productId: string, newPrice: number) => {
    const updated = productsList.map((prod) => {
      if (prod.id === productId) {
        return { ...prod, price: newPrice };
      }
      return prod;
    });
    saveProductsList(updated);
  };

  // Edit tier price
  const handleUpdateTierPrice = (productId: string, tierIndex: number, newPrice: number) => {
    const updated = productsList.map((prod) => {
      if (prod.id === productId && prod.tiers) {
        const updatedTiers = [...prod.tiers];
        updatedTiers[tierIndex] = { ...updatedTiers[tierIndex], price: newPrice };
        return { ...prod, tiers: updatedTiers };
      }
      return prod;
    });
    saveProductsList(updated);
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    if (confirm(language === 'id' ? 'Apakah Anda yakin ingin menghapus produk ini?' : 'Are you sure you want to delete this product?')) {
      const updated = productsList.filter((p) => p.id !== productId);
      saveProductsList(updated);
    }
  };

  // Add promo code
  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const codeClean = newPromoCode.trim().toUpperCase();
    if (!codeClean) return;

    if (newPromoDiscountAmount < 1000 || newPromoDiscountAmount > 100000) {
      alert(language === 'id' 
        ? 'Nominal diskon harus antara Rp 1.000 s/d Rp 100.000!' 
        : 'Discount amount must be between Rp 1,000 and Rp 100,000!'
      );
      return;
    }

    // Check if duplicate
    const exists = customPromos.some((p) => p.code === codeClean);
    if (exists) {
      alert(language === 'id' ? 'Kode promo ini sudah terdaftar!' : 'This promo code already exists!');
      return;
    }

    const newPromo: PromoCode = { 
      code: codeClean, 
      discountAmount: newPromoDiscountAmount, 
      isActive: true 
    };
    const updated = [newPromo, ...customPromos];
    saveCustomPromos(updated);

    setNewPromoCode('');
    setNewPromoDiscountAmount(10000);
    setPromoSuccessMsg(
      language === 'id'
        ? `Kode promo ${codeClean} berhasil ditambahkan!`
        : `Promo code ${codeClean} successfully added!`
    );

    setTimeout(() => setPromoSuccessMsg(''), 3000);
  };

  // Toggle promo code active status
  const handleTogglePromoActive = (code: string) => {
    const updated = customPromos.map((p) => {
      if (p.code === code) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    });
    saveCustomPromos(updated);
  };

  // Delete custom promo code
  const handleDeletePromo = (code: string) => {
    const updated = customPromos.filter((p) => p.code !== code);
    saveCustomPromos(updated);
  };

  // Create new custom testimonial
  const handleCreateTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testiName.trim() || !testiCommentId.trim()) {
      alert(language === 'id' ? 'Nama dan Ulasan wajib diisi!' : 'Name and Review comment are required!');
      return;
    }

    const newTestimonial = {
      name: testiName.trim(),
      role: '',
      rating: testiRating,
      avatar: '',
      commentId: testiCommentId.trim(),
      commentEn: testiCommentEn.trim() || testiCommentId.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newTestimonial, ...allTestimonials];
    saveAllTestimonials(updated);

    // reset fields
    setTestiName('');
    setTestiCommentId('');
    setTestiCommentEn('');
    setTestiRating(5);

    setTestiSuccessMsg(
      language === 'id'
        ? 'Testimoni sukses ditambahkan!'
        : 'Testimonial successfully created!'
    );
    setTimeout(() => setTestiSuccessMsg(''), 3000);
  };

  // Delete testimonial
  const handleDeleteTestimonial = (idx: number) => {
    if (confirm(language === 'id' ? 'Apakah Anda yakin ingin menghapus ulasan/testimoni ini?' : 'Are you sure you want to delete this testimonial?')) {
      const updated = allTestimonials.filter((_, i) => i !== idx);
      saveAllTestimonials(updated);
    }
  };

  // Dynamic Tier builders helper
  const addTierRow = () => {
    setTierInputs([...tierInputs, { name: '', price: 10000, badge: '' }]);
  };

  const removeTierRow = (idx: number) => {
    setTierInputs(tierInputs.filter((_, i) => i !== idx));
  };

  const handleTierChange = (idx: number, field: 'name' | 'price' | 'badge', value: any) => {
    const updated = [...tierInputs];
    updated[idx] = { ...updated[idx], [field]: value };
    setTierInputs(updated);
  };

  // Create new product submission
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodNameId || !prodNameEn || !prodTaglineId || !prodTaglineEn || !prodDescId || !prodDescEn) {
      alert(language === 'id' ? 'Semua kolom deskripsi wajib diisi!' : 'All descriptions are required!');
      return;
    }

    const generatedId = 'custom-' + Math.random().toString(36).substring(2, 11);

    // Process comma features lists
    const featuresIdArray = prodFeaturesId
      ? prodFeaturesId.split(',').map((f) => f.trim()).filter(Boolean)
      : ['File mod premium', 'Aman anti-ban', 'Bimbingan personal'];

    const featuresEnArray = prodFeaturesEn
      ? prodFeaturesEn.split(',').map((f) => f.trim()).filter(Boolean)
      : ['Premium mod file', 'Safe & anti-ban', 'Personal guide'];

    const newProduct: Product = {
      id: generatedId,
      category: prodCategory,
      iconName: prodIconName,
      badge: prodBadge ? prodBadge : undefined,
      rating: 5.0,
      salesCount: '0',
      price: prodPrice,
      hasTiers: prodHasTiers,
      tiers: prodHasTiers ? tierInputs.filter((t) => t.name.trim() !== '') : undefined,
      isOutOfStock: false,
      idTranslations: {
        name: prodNameId,
        tagline: prodTaglineId,
        description: prodDescId,
        features: featuresIdArray,
        specs: [
          { label: 'Platform', value: platformSpec },
          { label: 'Versi', value: versionSpec },
          { label: 'Ukuran', value: sizeSpec },
        ],
      },
      enTranslations: {
        name: prodNameEn,
        tagline: prodTaglineEn,
        description: prodDescEn,
        features: featuresEnArray,
        specs: [
          { label: 'Platform', value: platformSpec },
          { label: 'Version', value: versionSpec },
          { label: 'Size', value: sizeSpec },
        ],
      },
    };

    const updated = [newProduct, ...productsList];
    saveProductsList(updated);

    // Reset Form
    setProdNameId('');
    setProdNameEn('');
    setProdTaglineId('');
    setProdTaglineEn('');
    setProdDescId('');
    setProdDescEn('');
    setProdBadge('');
    setProdFeaturesId('');
    setProdFeaturesEn('');
    setProductSuccessMsg(
      language === 'id' ? 'Produk baru berhasil ditambahkan ke katalog!' : 'Product successfully added!'
    );

    setTimeout(() => setProductSuccessMsg(''), 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/90 backdrop-blur-md">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-950/20 via-black to-black" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-violet-900/40 bg-zinc-950 shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-900 bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/15 border border-violet-500/30 text-violet-400">
              <Icon name="ShieldAlert" size={20} />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wider text-white uppercase font-mono">
                {language === 'id' ? 'Dashboard Khusus Owner' : 'Owner Control Workspace'}
              </h2>
              <p className="text-[10px] text-zinc-500">
                {language === 'id' ? 'Sesi Aman • Kendali Penuh Katalog' : 'Secure Session • Full Catalogue Control'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {!isOwnerAuthenticated ? (
          /* Password Authentication Screen */
          <div className="p-6 md:p-12 flex flex-col items-center justify-center space-y-6 max-w-md mx-auto text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
              <Icon name="Lock" size={28} />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                {language === 'id' ? 'Masukkan Password Owner' : 'Verify Owner Key'}
              </h3>
              <p className="text-xs text-zinc-500">
                {language === 'id'
                  ? 'Area terenkripsi. Masukkan pin otorisasi untuk mengakses pengaturan harga, stok, dan promo.'
                  : 'Encrypted segment. Enter authorization pin to access prices, stock, and code settings.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="******"
                  className="w-full rounded-xl border border-zinc-850 bg-zinc-900 px-4 py-3.5 text-center text-lg font-mono text-white tracking-widest placeholder-zinc-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                {passwordError && (
                  <p className="text-xs text-rose-500 mt-2 font-medium">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-violet-600/10 transition-all duration-200"
              >
                {language === 'id' ? 'Masuk Dashboard' : 'Unlock Dashboard'}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard Panel */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[50vh]">
            {/* Left Sidebar Navigation Tabs */}
            <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-zinc-900 bg-zinc-950/40 p-4 space-y-2">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'products'
                    ? 'bg-violet-600 text-white shadow shadow-violet-600/10'
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon name="ShoppingBag" size={16} />
                <span>{language === 'id' ? 'Kelola Produk' : 'Manage Products'}</span>
              </button>

              <button
                onClick={() => setActiveTab('add-product')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'add-product'
                    ? 'bg-violet-600 text-white shadow shadow-violet-600/10'
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon name="Plus" size={16} />
                <span>{language === 'id' ? 'Tambah Produk' : 'New Product'}</span>
              </button>

              <button
                onClick={() => setActiveTab('promos')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'promos'
                    ? 'bg-violet-600 text-white shadow shadow-violet-600/10'
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon name="Tag" size={16} />
                <span>{language === 'id' ? 'Kode Promo' : 'Promo Codes'}</span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'testimonials'
                    ? 'bg-violet-600 text-white shadow shadow-violet-600/10'
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon name="MessageSquare" size={16} />
                <span>{language === 'id' ? 'Kelola Testimoni' : 'Testimonials'}</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-violet-600 text-white shadow shadow-violet-600/10'
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200'
                }`}
              >
                <Icon name="Sliders" size={16} />
                <span>{language === 'id' ? 'Konfigurasi Toko' : 'Store Settings'}</span>
              </button>

              <div className="pt-6 border-t border-zinc-900/60 mt-4 text-center">
                <button
                  onClick={() => setIsOwnerAuthenticated(false)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/20 rounded border border-red-950/20 transition-all duration-200"
                >
                  <Icon name="LogOut" size={14} />
                  <span>{language === 'id' ? 'Kunci Akses' : 'Lock Portal'}</span>
                </button>
              </div>
            </div>

            {/* Right Side Working Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-zinc-950/10">
              {/* TAB 1: PRODUCT MANAGEMENT LIST */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-900 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon name="Settings" size={18} className="text-violet-400" />
                      <span>{language === 'id' ? 'Ubah Harga & Status Stok' : 'Update Prices & Stock'}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {language === 'id'
                        ? 'Semua perubahan harga dan stock toggle langsung disimpan di browser (localStorage).'
                        : 'Any stock toggle or price modification is immediately saved.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {productsList.map((prod) => {
                      const name = language === 'id' ? prod.idTranslations.name : prod.enTranslations.name;
                      return (
                        <div
                          key={prod.id}
                          className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/60 flex flex-col space-y-4"
                        >
                          {/* Top Row */}
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/20">
                                <Icon name={prod.iconName} size={18} />
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                  {name}
                                  {prod.id.startsWith('custom-') && (
                                    <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 rounded">
                                      Custom
                                    </span>
                                  )}
                                </h4>
                                <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider block">
                                  Category: {prod.category}
                                </span>
                              </div>
                            </div>

                            {/* Stock Toggler Action Button */}
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`text-[10px] font-mono font-bold px-2 py-1 rounded border ${
                                  prod.isOutOfStock
                                    ? 'bg-rose-950/30 text-rose-500 border-rose-500/20'
                                    : 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20'
                                }`}
                              >
                                {prod.isOutOfStock ? 'STOK HABIS' : 'READY STOK'}
                              </span>

                              <button
                                onClick={() => handleToggleStock(prod.id)}
                                className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide transition-all ${
                                  prod.isOutOfStock
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                                }`}
                              >
                                {prod.isOutOfStock ? 'Ready-kan' : 'Habis-kan'}
                              </button>

                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-950/40 transition-colors"
                                title="Hapus Produk"
                              >
                                <Icon name="Trash2" size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Price Editors Row */}
                          <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 space-y-2">
                            {!prod.hasTiers ? (
                              /* Standard Price Edit */
                              <div className="flex items-center justify-between gap-4 flex-wrap">
                                <span className="text-xs font-medium text-zinc-400">
                                  {language === 'id' ? 'Harga Produk' : 'Product Price'} (IDR):
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-zinc-600">Rp</span>
                                  <input
                                    type="number"
                                    value={prod.price}
                                    onChange={(e) => handleUpdatePrice(prod.id, parseInt(e.target.value) || 0)}
                                    className="w-28 rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-white text-right font-mono focus:border-violet-500 focus:outline-none"
                                  />
                                </div>
                              </div>
                            ) : (
                              /* Multi-Tier Price Edit */
                              <div className="space-y-2.5">
                                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block">
                                  {language === 'id' ? 'Harga Per Lisensi / Paket' : 'License Pricing Tiers'}
                                </span>
                                {prod.tiers?.map((tier, tIdx) => (
                                  <div key={tIdx} className="flex items-center justify-between gap-4 flex-wrap text-xs">
                                    <span className="font-medium text-zinc-400">{tier.name}:</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-mono text-zinc-600">Rp</span>
                                      <input
                                        type="number"
                                        value={tier.price}
                                        onChange={(e) =>
                                          handleUpdateTierPrice(prod.id, tIdx, parseInt(e.target.value) || 0)
                                        }
                                        className="w-28 rounded bg-zinc-900 border border-zinc-800 px-2 py-1 text-xs text-white text-right font-mono focus:border-violet-500 focus:outline-none"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ADD NEW PRODUCT FORM */}
              {activeTab === 'add-product' && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-900 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon name="PlusCircle" size={18} className="text-violet-400" />
                      <span>{language === 'id' ? 'Tambah Aplikasi / Jasa Baru' : 'Create New Product'}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {language === 'id'
                        ? 'Produk yang dibuat akan langsung tampil di beranda utama sesuai dengan kategori masing-masing.'
                        : 'Products will display instantly on the catalogue according to selected category.'}
                    </p>
                  </div>

                  <form onSubmit={handleCreateProduct} className="space-y-5">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Nama Produk (ID)
                        </label>
                        <input
                          type="text"
                          required
                          value={prodNameId}
                          onChange={(e) => setProdNameId(e.target.value)}
                          placeholder="Contoh: APK Premium Bypass"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Product Name (EN)
                        </label>
                        <input
                          type="text"
                          required
                          value={prodNameEn}
                          onChange={(e) => setProdNameEn(e.target.value)}
                          placeholder="e.g. Bypass Premium APK"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Tagline Singkat (ID)
                        </label>
                        <input
                          type="text"
                          required
                          value={prodTaglineId}
                          onChange={(e) => setProdTaglineId(e.target.value)}
                          placeholder="Contoh: Cheat VIP & Anti-Banned"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Short Tagline (EN)
                        </label>
                        <input
                          type="text"
                          required
                          value={prodTaglineEn}
                          onChange={(e) => setProdTaglineEn(e.target.value)}
                          placeholder="e.g. Premium Hack & Safe"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Deskripsi Lengkap (ID)
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={prodDescId}
                          onChange={(e) => setProdDescId(e.target.value)}
                          placeholder="Berikan detail aplikasi, fitur khusus, dan garansi..."
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Full Description (EN)
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={prodDescEn}
                          onChange={(e) => setProdDescEn(e.target.value)}
                          placeholder="Detailed product capabilities, unique features, warranty..."
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Category & Icon selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Kategori (Category)
                        </label>
                        <select
                          value={prodCategory}
                          onChange={(e: any) => setProdCategory(e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        >
                          <option value="gaming">Gaming</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="tools">Tools</option>
                          <option value="services">Services</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Desain Ikon (Lucide Name)
                        </label>
                        <select
                          value={prodIconName}
                          onChange={(e) => setProdIconName(e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        >
                          <option value="Zap">Zap (Petir / Speed)</option>
                          <option value="Shield">Shield (Keamanan / Anti-Ban)</option>
                          <option value="Gamepad2">Gamepad2 (Gaming)</option>
                          <option value="Film">Film (Cinema / Bioskop)</option>
                          <option value="Wrench">Wrench (Tools / Modding)</option>
                          <option value="Flame">Flame (Hot / Sensitivitas)</option>
                          <option value="Heart">Heart (Suka / Jasa)</option>
                          <option value="Sparkles">Sparkles (Special)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Badge Khusus (Optional)
                        </label>
                        <input
                          type="text"
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          placeholder="Contoh: BEST SELLER, HOT, NEW"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Technical Specs inputs */}
                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                          Platform Spec
                        </label>
                        <input
                          type="text"
                          value={platformSpec}
                          onChange={(e) => setPlatformSpec(e.target.value)}
                          className="w-full rounded bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                          Versi Spec
                        </label>
                        <input
                          type="text"
                          value={versionSpec}
                          onChange={(e) => setVersionSpec(e.target.value)}
                          className="w-full rounded bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1">
                          Ukuran Spec
                        </label>
                        <input
                          type="text"
                          value={sizeSpec}
                          onChange={(e) => setSizeSpec(e.target.value)}
                          className="w-full rounded bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Dynamic features string list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Fitur Unggulan ID (Pisahkan dengan koma)
                        </label>
                        <input
                          type="text"
                          value={prodFeaturesId}
                          onChange={(e) => setProdFeaturesId(e.target.value)}
                          placeholder="Contoh: Fitur A, Fitur B, Garansi uang kembali"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1">
                          Key Features EN (Separate with comma)
                        </label>
                        <input
                          type="text"
                          value={prodFeaturesEn}
                          onChange={(e) => setProdFeaturesEn(e.target.value)}
                          placeholder="e.g. Feature A, Feature B, Moneyback Guarantee"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Pricing Type Toggle & Form */}
                    <div className="bg-zinc-900/30 p-5 rounded-xl border border-zinc-900 space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="hasTiers"
                          checked={prodHasTiers}
                          onChange={(e) => setProdHasTiers(e.target.checked)}
                          className="h-4 w-4 rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-violet-500"
                        />
                        <label htmlFor="hasTiers" className="text-xs font-bold text-white select-none cursor-pointer">
                          Produk ini memiliki varian paket / lisensi (Multi-tier pricing)
                        </label>
                      </div>

                      {!prodHasTiers ? (
                        /* Standard Pricing input */
                        <div className="max-w-xs">
                          <label className="block text-xs font-medium text-zinc-400 mb-1">
                            Harga Jual Dasar (IDR)
                          </label>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-zinc-500">Rp</span>
                            <input
                              type="number"
                              required={!prodHasTiers}
                              value={prodPrice}
                              onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)}
                              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-sm text-white font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        /* Multi Tier Pricing input form builder */
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                            <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">
                              Paket Lisensi
                            </span>
                            <button
                              type="button"
                              onClick={addTierRow}
                              className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase bg-violet-600 hover:bg-violet-500 text-white px-2 py-1 rounded"
                            >
                              <Icon name="Plus" size={12} />
                              Tambah Paket
                            </button>
                          </div>

                          {tierInputs.map((tier, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                              <div>
                                <label className="block text-[10px] text-zinc-500 mb-0.5">Nama Paket</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Contoh: Paket 3 Bulan"
                                  value={tier.name}
                                  onChange={(e) => handleTierChange(idx, 'name', e.target.value)}
                                  className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-xs text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] text-zinc-500 mb-0.5">Harga Paket (Rp)</label>
                                <input
                                  type="number"
                                  required
                                  value={tier.price}
                                  onChange={(e) =>
                                    handleTierChange(idx, 'price', parseInt(e.target.value) || 0)
                                  }
                                  className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-xs text-white font-mono"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <label className="block text-[10px] text-zinc-500 mb-0.5">Badge Paket</label>
                                  <input
                                    type="text"
                                    placeholder="Contoh: Terpopuler"
                                    value={tier.badge || ''}
                                    onChange={(e) => handleTierChange(idx, 'badge', e.target.value)}
                                    className="w-full rounded bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-xs text-white"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeTierRow(idx)}
                                  className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400"
                                >
                                  <Icon name="Trash2" size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-widest py-3.5 px-4 rounded-xl shadow-lg shadow-violet-600/15 transition-all duration-300"
                    >
                      Tambahkan Produk Baru
                    </button>

                    <AnimatePresence>
                      {productSuccessMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold text-center"
                        >
                          {productSuccessMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              )}

              {/* TAB 3: PROMO CODES LIST & CREATE */}
              {activeTab === 'promos' && (
                <div className="space-y-6">
                  <div className="border-b border-zinc-900 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon name="Tag" size={18} className="text-violet-400" />
                      <span>{language === 'id' ? 'Kelola Kode Promo' : 'Manage Promo Codes'}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {language === 'id'
                        ? 'Buat, aktifkan, atau nonaktifkan kode promo potongan harga nominal (Rp 1.000 s/d Rp 100.000).'
                        : 'Create, enable, or disable nominal flat discount promo codes (Rp 1,000 to Rp 100,000).'}
                    </p>
                  </div>

                  {/* Add Promo Code Form */}
                  <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
                    <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">
                      {language === 'id' ? 'Buat Kode Promo Baru' : 'Add New Promo Code'}
                    </h4>
                    <form onSubmit={handleCreatePromo} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                      <div>
                        <label className="block text-[10px] font-medium text-zinc-400 mb-1.5 uppercase">
                          {language === 'id' ? 'Kode Promo' : 'Promo Code'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newPromoCode}
                          onChange={(e) => setNewPromoCode(e.target.value)}
                          placeholder="e.g. HEMAT5000"
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white uppercase font-mono tracking-widest placeholder-zinc-700 focus:border-violet-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-zinc-400 mb-1.5 uppercase">
                          {language === 'id' ? 'Potongan Harga (Rp)' : 'Discount Amount (Rp)'}
                        </label>
                        <input
                          type="number"
                          required
                          min={1000}
                          max={100000}
                          value={newPromoDiscountAmount}
                          onChange={(e) => setNewPromoDiscountAmount(parseInt(e.target.value) || 0)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-white font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Icon name="Plus" size={13} />
                        <span>{language === 'id' ? 'Buat Kode' : 'Create Code'}</span>
                      </button>
                    </form>

                    <AnimatePresence>
                      {promoSuccessMsg && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-2.5 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-lg text-[11px] font-medium text-center mt-3"
                        >
                          {promoSuccessMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Promos list */}
                  <div className="space-y-3.5">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      {language === 'id' ? 'Daftar Kode Promo' : 'Promo Codes List'}
                    </h4>

                    {customPromos.length === 0 ? (
                      <p className="text-xs text-zinc-500 text-center py-4 italic">
                        {language === 'id' ? 'Belum ada kode promo.' : 'No promo codes available.'}
                      </p>
                    ) : (
                      customPromos.map((promo) => (
                        <div
                          key={promo.code}
                          className={`p-3.5 rounded-lg border transition-all duration-200 flex items-center justify-between ${
                            promo.isActive
                              ? 'border-zinc-900 bg-zinc-950/80'
                              : 'border-zinc-900/40 bg-zinc-950/30 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleTogglePromoActive(promo.code)}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                                promo.isActive
                                  ? 'bg-violet-600/15 border-violet-500/20 text-violet-400 hover:bg-violet-600/25'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'
                              }`}
                              title={promo.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                            >
                              <Icon name="Tag" size={14} />
                            </button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-extrabold text-white uppercase tracking-wider">
                                  {promo.code}
                                </span>
                                {promo.isDefault && (
                                  <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.5 rounded uppercase font-mono">
                                    Default
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                Diskon: Rp {promo.discountAmount.toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Toggle Switch Button */}
                            <button
                              onClick={() => handleTogglePromoActive(promo.code)}
                              className={`px-2 py-1 rounded text-[9px] font-extrabold uppercase tracking-wide border transition-all ${
                                promo.isActive
                                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/20 hover:bg-emerald-950/50'
                                  : 'bg-rose-950/30 text-rose-500 border-rose-500/20 hover:bg-rose-950/50'
                              }`}
                            >
                              {promo.isActive ? (
                                <span>{language === 'id' ? '● Aktif' : '● Active'}</span>
                              ) : (
                                <span>{language === 'id' ? '○ Nonaktif' : '○ Inactive'}</span>
                              )}
                            </button>

                            {!promo.isDefault && (
                              <button
                                onClick={() => handleDeletePromo(promo.code)}
                                className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 hover:border-red-500/20 transition-all"
                                title="Hapus Promo"
                              >
                                <Icon name="Trash2" size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: TESTIMONIALS MANAGEMENT */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-zinc-900 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon name="MessageSquare" size={18} className="text-violet-400" />
                      <span>{language === 'id' ? 'Kelola Testimoni & Ulasan' : 'Manage Testimonials & Reviews'}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {language === 'id'
                        ? 'Atur jumlah ulasan yang tampil di landing page, tambahkan testimoni buatan, atau hapus ulasan yang kurang sesuai.'
                        : 'Set the number of reviews displayed on the landing page, add manual testimonials, or delete unwanted reviews.'}
                    </p>
                  </div>

                  {/* Testimonial Configuration: Max shown */}
                  <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Icon name="Sliders" size={14} className="text-violet-400" />
                      <span>{language === 'id' ? 'Konfigurasi Tampilan' : 'Display Configuration'}</span>
                    </h4>
                    <div className="max-w-md">
                      <label className="block text-xs font-medium text-zinc-400 mb-2">
                        {language === 'id' 
                          ? 'Jumlah Testimoni Maksimal yang Ditampilkan (Running Marquee):' 
                          : 'Maximum Testimonials Displayed (Running Marquee):'}
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={maxTestimonialsShown}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 15;
                            saveMaxTestimonialsShown(val);
                          }}
                          className="w-24 rounded-lg border border-zinc-850 bg-zinc-900 px-3 py-2 text-sm text-white font-mono text-center focus:border-violet-500 focus:outline-none"
                        />
                        <span className="text-xs text-zinc-500">
                          {language === 'id' 
                            ? `Ulasan aktif teratas saat ini: ${Math.min(allTestimonials.length, maxTestimonialsShown)} dari ${allTestimonials.length} total.` 
                            : `Currently showing top ${Math.min(allTestimonials.length, maxTestimonialsShown)} out of ${allTestimonials.length} total reviews.`}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-600 mt-1.5 leading-relaxed">
                        {language === 'id'
                          ? '* Pengaturan ini langsung mengatur jumlah kartu ulasan yang berputar ke kiri secara dinamis di halaman depan.'
                          : '* This setting immediately limits the loop-count of testimonial cards sliding to the left.'}
                      </p>
                    </div>
                  </div>

                  {/* Add Custom Testimonial Form */}
                  <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
                    <h4 className="text-xs font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                      <Icon name="Plus" size={14} className="text-violet-400" />
                      <span>{language === 'id' ? 'Buat Testimoni Baru' : 'Add New Testimonial'}</span>
                    </h4>

                    <form onSubmit={handleCreateTestimonial} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                            {language === 'id' ? 'Nama Pembeli' : 'Customer Name'}
                          </label>
                          <input
                            type="text"
                            required
                            placeholder={language === 'id' ? 'Contoh: Randy Pangalila' : 'e.g. Randy Pangalila'}
                            value={testiName}
                            onChange={(e) => setTestiName(e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-violet-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                            {language === 'id' ? 'Rating Bintang' : 'Star Rating'}
                          </label>
                          <select
                            value={testiRating}
                            onChange={(e) => setTestiRating(parseInt(e.target.value) || 5)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs text-white focus:border-violet-500 focus:outline-none font-mono"
                          >
                            <option value="5">★★★★★ (5 Stars)</option>
                            <option value="4">★★★★☆ (4 Stars)</option>
                            <option value="3">★★★☆☆ (3 Stars)</option>
                            <option value="2">★★☆☆☆ (2 Stars)</option>
                            <option value="1">★☆☆☆☆ (1 Star)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                            {language === 'id' ? 'Isi Ulasan (Bahasa Indonesia)' : 'Review Text (Indonesian)'}
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder={language === 'id' ? 'Tulis komentar kepuasan pembeli...' : 'Enter client feedback...'}
                            value={testiCommentId}
                            onChange={(e) => setTestiCommentId(e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-violet-500 focus:outline-none resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                            {language === 'id' ? 'Isi Ulasan (Bahasa Inggris - Opsional)' : 'Review Text (English - Optional)'}
                          </label>
                          <textarea
                            rows={3}
                            placeholder={language === 'id' ? 'Komentar terjemahan bahasa Inggris (jika kosong, disamakan)' : 'English comment translation (falls back to Indonesian if left empty)'}
                            value={testiCommentEn}
                            onChange={(e) => setTestiCommentEn(e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-2 text-xs text-white placeholder-zinc-700 focus:border-violet-500 focus:outline-none resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg shadow shadow-violet-600/15 transition-all"
                      >
                        {language === 'id' ? 'Tambahkan Testimoni' : 'Save Testimonial'}
                      </button>

                      <AnimatePresence>
                        {testiSuccessMsg && (
                          <motion.div
                            initial={{ opacity: 0, y: 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-2 text-xs text-center font-bold text-emerald-400 bg-emerald-950/20 border border-emerald-500/10 rounded"
                          >
                            {testiSuccessMsg}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>

                  {/* Testimonial List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span>{language === 'id' ? 'Daftar Semua Ulasan' : 'All Review List'}</span>
                      <span className="font-mono text-zinc-500 normal-case">({allTestimonials.length} total)</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[30rem] overflow-y-auto pr-1">
                      {allTestimonials.length === 0 ? (
                        <div className="col-span-2 text-center py-10 rounded-xl border border-zinc-900 text-zinc-600 text-xs">
                          {language === 'id' ? 'Tidak ada ulasan.' : 'No testimonials active.'}
                        </div>
                      ) : (
                        allTestimonials.map((testi, idx) => {
                          const displayComment = language === 'id' ? testi.commentId : testi.commentEn;
                          // Obfuscate preview helper
                          const splitName = testi.name.split(' ');
                          const maskedPreview = splitName.map((word: string) => {
                            if (word.length <= 1) return word;
                            if (word.length === 2) return word[0] + '*';
                            if (word.length === 3) return word[0] + '*' + word[2];
                            return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
                          }).join(' ');

                          return (
                            <div
                              key={idx}
                              className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950/70 transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div>
                                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                                      <span>{testi.name}</span>
                                      <span className="text-[9px] text-zinc-500 font-normal">
                                        ({language === 'id' ? 'Samaran:' : 'Masked:'} <code className="text-amber-400/80 font-mono">{maskedPreview}</code>)
                                      </span>
                                    </h5>
                                  </div>

                                  <div className="flex items-center gap-0.5 text-amber-400">
                                    {Array.from({ length: testi.rating }).map((_, i) => (
                                      <Icon key={i} name="Star" size={10} fill="currentColor" />
                                    ))}
                                  </div>
                                </div>

                                <p className="text-[11px] text-zinc-400 italic leading-relaxed line-clamp-3">
                                  "{displayComment}"
                                </p>
                              </div>

                              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-2 mt-3 text-[10px] text-zinc-600">
                                <span className="font-mono">{testi.date || 'No Date'}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTestimonial(idx)}
                                  className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 border border-zinc-850 text-zinc-500 hover:text-red-400 hover:border-red-500/20 transition-all font-extrabold uppercase text-[9px]"
                                >
                                  <Icon name="Trash2" size={11} />
                                  <span>{language === 'id' ? 'Hapus' : 'Delete'}</span>
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SHOP CONFIGURATION & VISUAL THEME */}
              {activeTab === 'settings' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="border-b border-zinc-900 pb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon name="Sliders" size={18} className="text-violet-400" />
                      <span>{language === 'id' ? 'Konfigurasi Toko & Tampilan' : 'Store Settings & Theme'}</span>
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {language === 'id'
                        ? 'Atur batasan minimal pembelian dan sesuaikan warna dasar UI website secara langsung menggunakan slider RGB.'
                        : 'Configure the minimum purchase amount and customize the website UI colors in real time with RGB sliders.'}
                    </p>
                  </div>

                  {/* SECTION 1: MINIMUM PURCHASE LIMIT */}
                  <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <Icon name="ShoppingBag" size={16} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {language === 'id' ? 'Minimal Jumlah Produk' : 'Minimum Product Quantity'}
                      </h4>
                    </div>

                    <div className="max-w-md space-y-3">
                      <label className="block text-xs font-medium text-zinc-400">
                        {language === 'id'
                          ? 'Jumlah Minimal Produk yang Dibeli (pcs / item):'
                          : 'Minimum Product Quantity to Purchase (pcs / items):'}
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={minPurchaseQty}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              saveMinPurchaseQty(val);
                            }}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
                            placeholder="0"
                          />
                        </div>
                        <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1.5 rounded font-mono shrink-0">
                          {minPurchaseQty === 0 
                            ? (language === 'id' ? 'Tanpa Minimal' : 'No Minimum') 
                            : `${minPurchaseQty} pcs`}
                        </span>
                      </div>

                      {/* Quick presets buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[0, 1, 2, 3, 5, 10].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => saveMinPurchaseQty(preset)}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono transition-all ${
                              minPurchaseQty === preset
                                ? 'bg-violet-600 text-white'
                                : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300 border border-zinc-850'
                            }`}
                          >
                            {preset === 0 ? (language === 'id' ? '0 (Nonaktif)' : '0 (Disable)') : `${preset} pcs`}
                          </button>
                        ))}
                      </div>

                      <p className="text-[10px] text-zinc-600 leading-relaxed">
                        {language === 'id'
                          ? '* Tombol checkout pesanan via WhatsApp akan terkunci apabila total jumlah produk dalam keranjang belanja masih di bawah batas minimal ini.'
                          : '* The checkout action to WhatsApp will be locked until the total number of items in the cart matches or exceeds this set limit.'}
                      </p>
                    </div>
                  </div>

                  {/* SECTION 2: WEBSITE COLOR THEME */}
                  <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                        <Icon name="Palette" size={16} />
                      </div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {language === 'id' ? 'Warna Tema UI Website (RGB)' : 'Website UI Theme Color (RGB)'}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        {/* Preset Colors */}
                        <div>
                          <label className="block text-xs font-medium text-zinc-400 mb-2.5">
                            {language === 'id' ? 'Pilih Warna Preset:' : 'Select Preset Color:'}
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {COLOR_PRESETS.map((preset) => {
                              const isActive = themeColor.r === preset.r && themeColor.g === preset.g && themeColor.b === preset.b;
                              return (
                                <button
                                  key={preset.hex}
                                  type="button"
                                  onClick={() => saveThemeColor({ r: preset.r, g: preset.g, b: preset.b })}
                                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                                    isActive
                                      ? 'bg-zinc-900 border-violet-500/50 text-white'
                                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-300'
                                  }`}
                                >
                                  <span
                                    className="h-3.5 w-3.5 rounded-full shrink-0 border border-black/30"
                                    style={{ backgroundColor: preset.hex }}
                                  />
                                  <span>{language === 'id' ? preset.nameId : preset.nameEn}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* HTML Color Picker */}
                        <div className="pt-2">
                          <label className="block text-xs font-medium text-zinc-400 mb-2 flex items-center justify-between">
                            <span>{language === 'id' ? 'Gunakan Color Picker:' : 'Use Color Picker:'}</span>
                            <span className="text-[10px] font-mono text-zinc-600">({rgbToHex(themeColor.r, themeColor.g, themeColor.b).toUpperCase()})</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={rgbToHex(themeColor.r, themeColor.g, themeColor.b)}
                              onChange={(e) => {
                                const rgb = hexToRgb(e.target.value);
                                if (rgb) {
                                  saveThemeColor(rgb);
                                }
                              }}
                              className="h-9 w-16 bg-zinc-900 border border-zinc-800 rounded cursor-pointer p-0.5"
                            />
                            <p className="text-[10px] text-zinc-500">
                              {language === 'id' 
                                ? 'Klik kotak warna di samping untuk memilih warna custom secara bebas di palet.' 
                                : 'Click the color box to freely choose custom colors from the palette.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* RGB SLIDERS & LIVE PREVIEW */}
                      <div className="space-y-4 border-t md:border-t-0 md:border-l border-zinc-900/60 pt-4 md:pt-0 md:pl-6">
                        <label className="block text-xs font-medium text-zinc-400">
                          {language === 'id' ? 'Sesuaikan RGB Slider:' : 'Adjust RGB Sliders:'}
                        </label>

                        {/* Slider R */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>Red (Merah)</span>
                            <span className="font-bold text-red-400">{themeColor.r}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="255"
                            value={themeColor.r}
                            onChange={(e) => {
                              const rVal = parseInt(e.target.value) || 0;
                              saveThemeColor({ ...themeColor, r: rVal });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg cursor-pointer"
                            style={{ accentColor: 'rgb(239, 68, 68)' }}
                          />
                        </div>

                        {/* Slider G */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>Green (Hijau)</span>
                            <span className="font-bold text-emerald-400">{themeColor.g}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="255"
                            value={themeColor.g}
                            onChange={(e) => {
                              const gVal = parseInt(e.target.value) || 0;
                              saveThemeColor({ ...themeColor, g: gVal });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg cursor-pointer"
                            style={{ accentColor: 'rgb(16, 185, 129)' }}
                          />
                        </div>

                        {/* Slider B */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                            <span>Blue (Biru)</span>
                            <span className="font-bold text-blue-400">{themeColor.b}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="255"
                            value={themeColor.b}
                            onChange={(e) => {
                              const bVal = parseInt(e.target.value) || 0;
                              saveThemeColor({ ...themeColor, b: bVal });
                            }}
                            className="w-full h-1 bg-zinc-900 rounded-lg cursor-pointer"
                            style={{ accentColor: 'rgb(14, 165, 233)' }}
                          />
                        </div>

                        {/* Color Code Preview badge */}
                        <div className="mt-4 p-3 rounded-lg border border-zinc-850 bg-zinc-900/60 flex flex-col items-center justify-center text-center space-y-1.5">
                          <div 
                            className="h-6 w-full rounded-md shadow-inner border border-black/20"
                            style={{ backgroundColor: `rgb(${themeColor.r}, ${themeColor.g}, ${themeColor.b})` }}
                          />
                          <div className="text-[11px] font-mono font-bold text-zinc-300">
                            rgb({themeColor.r}, {themeColor.g}, {themeColor.b})
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
