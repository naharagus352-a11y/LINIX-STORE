import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, AppLanguage } from '../types';
import Icon from './Icon';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveFromCart: (productId: string, tierName?: string) => void;
  onUpdateQuantity: (productId: string, tierName: string | undefined, delta: number) => void;
  language: AppLanguage;
  onClearCart: () => void;
  minPurchaseQty: number;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
  language,
  onClearCart,
  minPurchaseQty,
}: CartDrawerProps) {
  const [userName, setUserName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'dana' | 'gopay'>('dana');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmountVal, setDiscountAmountVal] = useState(0);

  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      const price = item.selectedTierPrice !== undefined ? item.selectedTierPrice : item.product.price;
      return acc + (price * item.quantity);
    }, 0);
  };

  const handleApplyPromo = () => {
    const codeClean = promoCode.trim().toUpperCase();
    if (!codeClean) return;

    let promoList: any[] = [
      { code: 'LEXPRO', discountAmount: 10000, isActive: true, isDefault: true },
      { code: 'BIOSKOP', discountAmount: 5000, isActive: true, isDefault: true }
    ];

    try {
      const savedCustom = localStorage.getItem('lex_store_promo_codes_v2');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          promoList = parsed;
        }
      }
    } catch (err) {
      console.error('Failed to load custom promos in CartDrawer', err);
    }

    const matched = promoList.find((p) => p.code.toUpperCase() === codeClean);

    if (matched) {
      if (!matched.isActive) {
        alert(language === 'id' ? 'Kode promo ini sedang dinonaktifkan!' : 'This promo code is currently deactivated!');
        return;
      }
      setDiscountAmountVal(matched.discountAmount);
      setPromoApplied(true);
    } else {
      alert(language === 'id' ? 'Kode promo tidak valid!' : 'Invalid promo code!');
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(false);
    setDiscountAmountVal(0);
    setPromoCode('');
  };

  const subtotal = calculateSubtotal();
  const discountAmount = promoApplied ? Math.min(subtotal, discountAmountVal) : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const totalItemsQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isBelowMinimum = minPurchaseQty > 0 && totalItemsQty < minPurchaseQty;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    if (isBelowMinimum) {
      alert(language === 'id' 
        ? `Minimal pembelian adalah ${minPurchaseQty} produk. Keranjang Anda baru memiliki ${totalItemsQty} produk.` 
        : `The minimum purchase is ${minPurchaseQty} products. Your cart only has ${totalItemsQty} products.`
      );
      return;
    }

    // Compose a beautifully formatted WhatsApp message
    const phoneNumber = '6285880386301';
    
    let message = '';
    if (language === 'id') {
      message += `⚡ *LEX STORE ORDER CONFIRMATION* ⚡\n`;
      message += `--------------------------------------\n`;
      if (userName.trim()) {
        message += `👤 *Nama Pembeli:* ${userName}\n`;
      }
      message += `💳 *Metode Pembayaran:* ${paymentMethod.toUpperCase()}\n`;
      message += `📅 *Tanggal:* ${new Date().toLocaleDateString('id-ID')}\n\n`;
      message += `🛒 *Daftar Aplikasi:* \n`;
      
      cartItems.forEach((item, index) => {
        const title = item.product.idTranslations.name;
        const tierStr = item.selectedTierName ? ` (${item.selectedTierName})` : '';
        const price = item.selectedTierPrice !== undefined ? item.selectedTierPrice : item.product.price;
        const formattedPrice = price === 0 ? 'FREE' : `Rp ${price.toLocaleString('id-ID')}`;
        message += `${index + 1}. *${title}*${tierStr}\n`;
        message += `   └ Jumlah: ${item.quantity}x | Harga: ${formattedPrice}\n`;
      });

      message += `\n--------------------------------------\n`;
      message += `💵 *Subtotal:* Rp ${subtotal.toLocaleString('id-ID')}\n`;
      if (promoApplied) {
        message += `🎟️ *Diskon:* -Rp ${discountAmount.toLocaleString('id-ID')}\n`;
      }
      message += `💰 *TOTAL BAYAR:* *Rp ${finalTotal.toLocaleString('id-ID')}*\n`;
      message += `--------------------------------------\n\n`;
      message += `💬 _"Dapatkan akses eksklusif dengan menghubungi admin melalui link WhatsApp ini sekarang."_\n`;
      message += `Mohon dibantu instruksi pembayaran dan link download aplikasinya, Admin! 🙏`;
    } else {
      message += `⚡ *LEX STORE ORDER CONFIRMATION* ⚡\n`;
      message += `--------------------------------------\n`;
      if (userName.trim()) {
        message += `👤 *Buyer Name:* ${userName}\n`;
      }
      message += `💳 *Payment Method:* ${paymentMethod.toUpperCase()}\n`;
      message += `📅 *Date:* ${new Date().toLocaleDateString('en-US')}\n\n`;
      message += `🛒 *App List:* \n`;
      
      cartItems.forEach((item, index) => {
        const title = item.product.enTranslations.name;
        const tierStr = item.selectedTierName ? ` (${item.selectedTierName})` : '';
        const price = item.selectedTierPrice !== undefined ? item.selectedTierPrice : item.product.price;
        const formattedPrice = price === 0 ? 'FREE' : `Rp ${price.toLocaleString('id-ID')}`;
        message += `${index + 1}. *${title}*${tierStr}\n`;
        message += `   └ Qty: ${item.quantity}x | Price: ${formattedPrice}\n`;
      });

      message += `\n--------------------------------------\n`;
      message += `💵 *Subtotal:* Rp ${subtotal.toLocaleString('id-ID')}\n`;
      if (promoApplied) {
        message += `🎟️ *Promo Discount:* -Rp ${discountAmount.toLocaleString('id-ID')}\n`;
      }
      message += `💰 *TOTAL DUE:* *Rp ${finalTotal.toLocaleString('id-ID')}*\n`;
      message += `--------------------------------------\n\n`;
      message += `💬 _"Get exclusive access by contacting the admin via this WhatsApp link right now."_\n`;
      message += `Please assist me with the payment process and the private app download links, Admin! 🙏`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in a new window/tab safely
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35 }}
              className="w-screen max-w-md border-l border-zinc-850 bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between pb-5 border-b border-zinc-900">
                  <div className="flex items-center gap-2 text-white">
                    <Icon name="ShoppingBag" className="text-violet-400" />
                    <h3 className="text-lg font-bold tracking-tight">
                      {language === 'id' ? 'Keranjang Belanja' : 'Shopping Cart'}
                    </h3>
                    <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full font-bold ml-1">
                      {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>

                {/* Buyer Info Form */}
                <div className="mt-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    {language === 'id' ? 'Nama Anda (Opsional)' : 'Your Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={language === 'id' ? 'Masukkan nama lengkap Anda...' : 'Enter your name...'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="mt-4 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    {language === 'id' ? 'Pilih Metode Pembayaran' : 'Select Payment Method'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('dana')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                        paymentMethod === 'dana'
                          ? 'border-sky-500 bg-sky-950/15 text-sky-400 shadow-lg shadow-sky-500/5'
                          : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {paymentMethod === 'dana' && (
                        <div className="absolute top-1.5 right-1.5 text-sky-400">
                          <Icon name="Check" size={12} />
                        </div>
                      )}
                      <div className="text-xs font-bold uppercase tracking-widest font-mono">DANA</div>
                      <span className="text-[10px] text-zinc-500 mt-1 font-sans">
                        {language === 'id' ? 'E-Wallet Dana' : 'Dana E-Wallet'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('gopay')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                        paymentMethod === 'gopay'
                          ? 'border-emerald-500 bg-emerald-950/15 text-emerald-400 shadow-lg shadow-emerald-500/5'
                          : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      {paymentMethod === 'gopay' && (
                        <div className="absolute top-1.5 right-1.5 text-emerald-400">
                          <Icon name="Check" size={12} />
                        </div>
                      )}
                      <div className="text-xs font-bold uppercase tracking-widest font-mono">GOPAY</div>
                      <span className="text-[10px] text-zinc-500 mt-1 font-sans">
                        {language === 'id' ? 'E-Wallet GoPay' : 'GoPay E-Wallet'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="mt-6 flex-1 overflow-y-auto max-h-[35vh] pr-1 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-zinc-600 border border-zinc-800 mb-3">
                        <Icon name="ShoppingBag" size={20} />
                      </div>
                      <p className="text-sm font-semibold text-zinc-400">
                        {language === 'id' ? 'Keranjang Anda kosong' : 'Your cart is empty'}
                      </p>
                      <p className="text-xs text-zinc-600 mt-1">
                        {language === 'id' 
                          ? 'Tambahkan beberapa aplikasi premium untuk memulai.' 
                          : 'Add premium apps to complete your setup.'}
                      </p>
                    </div>
                  ) : (
                    cartItems.map((item, index) => {
                      const title = language === 'id' ? item.product.idTranslations.name : item.product.enTranslations.name;
                      const price = item.selectedTierPrice !== undefined ? item.selectedTierPrice : item.product.price;
                      return (
                        <div key={`${item.product.id}-${item.selectedTierName || ''}`} className="flex items-start justify-between gap-3 p-3 rounded-lg border border-zinc-900 bg-zinc-900/20">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-600/10 text-violet-400 border border-violet-500/20">
                              <Icon name={item.product.iconName} size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white line-clamp-1">{title}</h4>
                              {item.selectedTierName && (
                                <span className="inline-block text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded mt-0.5 border border-zinc-700/50">
                                  {item.selectedTierName}
                                </span>
                              )}
                              <div className="text-xs font-bold text-violet-400 mt-1">
                                {price === 0 ? 'FREE' : `Rp ${price.toLocaleString('id-ID')}`}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => onRemoveFromCart(item.product.id, item.selectedTierName)}
                              className="text-zinc-600 hover:text-red-400 transition-colors"
                            >
                              <Icon name="Trash2" size={14} />
                            </button>
                            <div className="flex items-center gap-2 border border-zinc-800 bg-zinc-950 rounded px-1.5 py-0.5">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedTierName, -1)}
                                className="text-zinc-400 hover:text-white p-0.5"
                                disabled={item.quantity <= 1}
                              >
                                <Icon name="Minus" size={11} />
                              </button>
                              <span className="text-xs font-bold text-zinc-200 font-mono w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.selectedTierName, 1)}
                                className="text-zinc-400 hover:text-white p-0.5"
                              >
                                <Icon name="Plus" size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Footer Summary & Checkout */}
              <div className="border-t border-zinc-900 pt-5 mt-6 space-y-4">
                {/* Promo Code Area */}
                {cartItems.length > 0 && (
                  <div className="bg-zinc-900/20 border border-zinc-900 rounded-lg p-3">
                    {!promoApplied ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder={language === 'id' ? 'Kode Promo (e.g., LEXPRO)' : 'Promo Code'}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-violet-500 uppercase font-mono"
                        />
                        <button
                          onClick={handleApplyPromo}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded font-bold transition-colors"
                        >
                          {language === 'id' ? 'Gunakan' : 'Apply'}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 flex items-center gap-1 font-medium font-mono">
                          <Icon name="Check" size={12} />
                          {promoCode.toUpperCase()} APPLIED (-Rp {discountAmountVal.toLocaleString('id-ID')})
                        </span>
                        <button
                          onClick={handleRemovePromo}
                          className="text-zinc-500 hover:text-red-400 font-bold"
                        >
                          {language === 'id' ? 'Hapus' : 'Remove'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-zinc-500">
                    <span>Subtotal</span>
                    <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-emerald-500">
                      <span>{language === 'id' ? 'Diskon Promo' : 'Promo Discount'}</span>
                      <span className="font-mono">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white text-base pt-2 border-t border-zinc-900">
                    <span>Total</span>
                    <span className="text-violet-400 font-mono">Rp {finalTotal.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {isBelowMinimum && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Icon name="AlertTriangle" size={14} className="text-red-400" />
                        <span>{language === 'id' ? 'Minimal Jumlah Pembelian Belum Terpenuhi' : 'Minimum Item Quantity Not Met'}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-zinc-400">
                        {language === 'id'
                          ? `Minimal pembelian untuk pesanan ini adalah ${minPurchaseQty} produk. Silakan tambahkan ${minPurchaseQty - totalItemsQty} produk lagi ke keranjang.`
                          : `The minimum purchase is ${minPurchaseQty} products. Please add ${minPurchaseQty - totalItemsQty} more product(s) to proceed.`}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0 || isBelowMinimum}
                    className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 ${
                      (cartItems.length > 0 && !isBelowMinimum)
                        ? 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/10 active:scale-[0.98]'
                        : 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-800 opacity-60'
                    }`}
                  >
                    <Icon name="MessageCircle" size={18} fill="currentColor" />
                    {language === 'id' ? 'Kirim Pesanan ke WhatsApp' : 'Order via WhatsApp'}
                  </button>

                  {cartItems.length > 0 && (
                    <button
                      onClick={onClearCart}
                      className="w-full py-2 px-4 rounded-lg font-semibold text-xs text-zinc-500 hover:text-red-400 border border-zinc-900 hover:border-red-950/40 bg-transparent transition-all duration-200 text-center"
                    >
                      {language === 'id' ? 'Kosongkan Keranjang' : 'Clear Shopping Cart'}
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-zinc-600 text-center leading-normal">
                  {language === 'id'
                    ? 'Hubungi admin melalui link WhatsApp di atas sekarang untuk penyelesaian pembayaran dan bantuan kilat.'
                    : 'Connect directly with the admin via the WhatsApp link above to settle transaction & secure links.'}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
