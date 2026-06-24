import React from 'react';
import { Product, AppLanguage } from '../types';
import Icon from './Icon';

interface ProductCardProps {
  product: Product;
  language: AppLanguage;
  onOpenDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  key?: React.Key;
}

export default function ProductCard({
  product,
  language,
  onOpenDetails,
  onAddToCart,
}: ProductCardProps) {
  const translation = language === 'id' ? product.idTranslations : product.enTranslations;

  const formatPrice = () => {
    if (product.hasTiers && product.tiers) {
      const minPrice = Math.min(...product.tiers.map(t => t.price));
      const maxPrice = Math.max(...product.tiers.map(t => t.price));
      return `Rp ${minPrice.toLocaleString('id-ID')} - Rp ${maxPrice.toLocaleString('id-ID')}`;
    }
    return `Rp ${product.price.toLocaleString('id-ID')}`;
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet-500/50 hover:bg-zinc-950/80 hover:shadow-2xl hover:shadow-violet-600/5">
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 -z-10 bg-radial-gradient from-violet-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
            <Icon name={product.iconName} size={22} />
          </div>
          {product.badge && (
            <span className="rounded-full bg-violet-950/60 border border-violet-900/40 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-400">
              {product.badge}
            </span>
          )}
        </div>

        {/* Card Content */}
        <div className="mt-4">
          <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors duration-200">
            {translation.name}
          </h3>
          <p className="text-xs text-violet-300/80 font-medium mt-1">
            {translation.tagline}
          </p>
          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {translation.description}
          </p>
        </div>

        {/* Specifications Highlight */}
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-zinc-900 pt-3">
          {translation.specs.slice(0, 2).map((spec, idx) => (
            <span
              key={idx}
              className="rounded bg-zinc-900/50 px-2 py-0.5 text-[10px] font-medium text-zinc-400 border border-zinc-800/60"
            >
              {spec.label}: {spec.value}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Details & Pricing */}
      <div className="mt-5 border-t border-zinc-900 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <div className="flex items-center text-amber-400">
              <Icon name="Star" size={13} fill="currentColor" />
            </div>
            <span className="text-xs font-semibold text-zinc-300">{product.rating}</span>
            <span className="text-[10px] text-zinc-500">({product.salesCount})</span>
          </div>
          <span className={`text-xs font-mono font-medium ${product.isOutOfStock ? 'text-rose-500' : 'text-emerald-400'}`}>
            {product.isOutOfStock 
              ? (language === 'id' ? 'STOK HABIS' : 'OUT OF STOCK')
              : (language === 'id' ? 'READY STOK' : 'IN STOCK')}
          </span>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              {language === 'id' ? 'Harga' : 'Price'}
            </span>
            <span className="text-base font-black text-white tracking-tight">
              {formatPrice()}
            </span>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onOpenDetails(product)}
              className="rounded-lg border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 text-xs font-bold transition-all duration-200"
            >
              Detail
            </button>
            <button
              onClick={() => !product.isOutOfStock && onAddToCart(product)}
              disabled={product.isOutOfStock}
              className={`rounded-lg text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1 transition-all duration-200 ${
                product.isOutOfStock 
                  ? 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-50'
                  : 'bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-600/10 active:scale-95'
              }`}
            >
              <Icon name={product.isOutOfStock ? "Slash" : "Plus"} size={13} />
              {product.isOutOfStock 
                ? (language === 'id' ? 'HABIS' : 'SOLD OUT')
                : (language === 'id' ? 'Beli' : 'Buy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
