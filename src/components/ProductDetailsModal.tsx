import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, AppLanguage } from '../types';
import Icon from './Icon';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onAddToCart: (product: Product, selectedTierIndex?: number) => void;
}

export default function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  language,
  onAddToCart,
}: ProductDetailsModalProps) {
  const [selectedTier, setSelectedTier] = useState<number>(0);

  if (!product) return null;

  const translation = language === 'id' ? product.idTranslations : product.enTranslations;

  const handleAddClick = () => {
    onAddToCart(product, product.hasTiers ? selectedTier : undefined);
    onClose();
  };

  const activePrice = product.hasTiers && product.tiers 
    ? product.tiers[selectedTier].price 
    : product.price;

  const formatPrice = (price: number) => {
    if (price === 0) return 'FREE';
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <Icon name="X" size={18} />
            </button>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
              {/* Product Info - Left Side (8 cols on md) */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20">
                      <Icon name={product.iconName} size={26} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-950/40 border border-violet-900/30 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                        {translation.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm text-violet-300 font-medium mt-4">
                    {translation.tagline}
                  </p>
                  
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    {translation.description}
                  </p>

                  {/* Features */}
                  <div className="mt-6">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                      {language === 'id' ? 'Fitur Utama' : 'Key Features'}
                    </h4>
                    <ul className="space-y-2">
                      {translation.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mt-0.5 border border-emerald-500/20">
                            <Icon name="Check" size={12} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="mt-8 pt-6 border-t border-zinc-900">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">
                    {language === 'id' ? 'Informasi Teknis' : 'Technical Specifications'}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {translation.specs.map((spec, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-xs text-zinc-500">{spec.label}</span>
                        <span className="text-sm font-medium text-zinc-200">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Purchase Sidebar - Right Side (5 cols on md) */}
              <div className="md:col-span-5 flex flex-col justify-between bg-zinc-900/40 rounded-xl border border-zinc-800/60 p-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Icon name="Star" size={16} fill="currentColor" />
                      <span className="text-sm font-bold">{product.rating}</span>
                    </div>
                    <span className="text-xs text-zinc-400">
                      {product.salesCount} {language === 'id' ? 'terjual' : 'sold'}
                    </span>
                  </div>

                  {/* Tier Selector (For products with multiple tiers) */}
                  {product.hasTiers && product.tiers && (
                    <div className="mb-6">
                      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 block mb-2">
                        {language === 'id' ? 'Pilih Paket' : 'Select License Tier'}
                      </label>
                      <div className="space-y-2.5">
                        {product.tiers.map((tier, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedTier(idx)}
                            className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                              selectedTier === idx
                                ? 'border-violet-500 bg-violet-600/10 text-white'
                                : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-sm">{tier.name}</div>
                              <span className="text-xs opacity-70">
                                {tier.price === 0 ? 'Standard access' : 'Full access config'}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-sm">
                                {tier.price === 0 ? 'FREE' : `Rp ${tier.price.toLocaleString('id-ID')}`}
                              </div>
                              {tier.badge && (
                                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono uppercase">
                                  {tier.badge}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pricing Overview */}
                  <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800/80 mb-6">
                    <span className="text-xs text-zinc-500 block">
                      {language === 'id' ? 'Total Harga' : 'Total Price'}
                    </span>
                    <span className="text-2xl font-black text-white tracking-tight">
                      {formatPrice(activePrice)}
                    </span>
                    {product.isOutOfStock ? (
                      <span className="text-xs text-rose-500 block mt-1 flex items-center gap-1 font-bold">
                        <Icon name="Slash" size={13} />
                        {language === 'id' ? 'STOK HABIS' : 'OUT OF STOCK'}
                      </span>
                    ) : (
                      <span className="text-xs text-emerald-400 block mt-1 flex items-center gap-1 font-medium">
                        <Icon name="ShieldCheck" size={13} />
                        {language === 'id' ? 'Sekali Bayar & Aman' : 'One-time Payment & Secure'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddClick}
                    disabled={product.isOutOfStock}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                      product.isOutOfStock 
                        ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed opacity-60 shadow-none'
                        : 'bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-violet-600/20'
                    }`}
                  >
                    <Icon name={product.isOutOfStock ? "Slash" : "ShoppingBag"} size={16} />
                    {product.isOutOfStock 
                      ? (language === 'id' ? 'STOK HABIS' : 'OUT OF STOCK')
                      : (language === 'id' ? 'Tambah Ke Keranjang' : 'Add To Cart')}
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center leading-normal">
                    {language === 'id' 
                      ? 'Setelah checkout, Anda akan langsung terhubung ke WhatsApp Admin untuk pengiriman file.' 
                      : 'After checkout, you will instantly connect to WhatsApp Admin for file delivery.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
