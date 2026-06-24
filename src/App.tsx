import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLanguage, Product, CartItem, PromoCode } from './types';
import { PRODUCTS, TESTIMONIALS } from './data';
import Icon from './components/Icon';
import ProductCard from './components/ProductCard';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import FAQSection from './components/FAQSection';
import StatsSection from './components/StatsSection';
import ChannelWidget from './components/ChannelWidget';
import OwnerDashboardModal from './components/OwnerDashboardModal';

export function maskName(name: string): string {
  if (!name) return '';
  return name.split(' ').map(word => {
    if (word.length <= 1) return word;
    if (word.length === 2) return word[0] + '*';
    if (word.length === 3) return word[0] + '*' + word[2];
    return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
  }).join(' ');
}

export default function App() {
  const [language, setLanguage] = useState<AppLanguage>('id');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'gaming' | 'entertainment' | 'tools' | 'services'>('all');
  const [scrolled, setScrolled] = useState(false);
  const [allTestimonials, setAllTestimonials] = useState<any[]>(TESTIMONIALS);
  const [maxTestimonialsShown, setMaxTestimonialsShown] = useState<number>(15);

  const [minPurchaseQty, setMinPurchaseQty] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('lex_store_min_qty_v3');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [themeColor, setThemeColor] = useState<{ r: number; g: number; b: number }>(() => {
    try {
      const saved = localStorage.getItem('lex_store_theme_rgb_v3');
      return saved ? JSON.parse(saved) : { r: 139, g: 92, b: 246 };
    } catch {
      return { r: 139, g: 92, b: 246 };
    }
  });

  // User review form states
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  // Handle scroll listener for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load custom testimonials and configs on init
  useEffect(() => {
    try {
      const savedAll = localStorage.getItem('lex_store_all_testimonials_v3');
      if (savedAll) {
        setAllTestimonials(JSON.parse(savedAll));
      } else {
        // Upgrade / seed from old or default
        const oldReviews = localStorage.getItem('lex_store_custom_reviews');
        let initialList = [...TESTIMONIALS];
        if (oldReviews) {
          try {
            const parsed = JSON.parse(oldReviews);
            if (Array.isArray(parsed)) {
              initialList = [...parsed, ...initialList];
            }
          } catch (e) {}
        }
        setAllTestimonials(initialList);
        localStorage.setItem('lex_store_all_testimonials_v3', JSON.stringify(initialList));
      }

      const savedMax = localStorage.getItem('lex_store_max_testimonials');
      if (savedMax) {
        setMaxTestimonialsShown(parseInt(savedMax) || 15);
      }
    } catch (err) {
      console.error('Failed to load testimonials on init', err);
    }
  }, []);

  const saveAllTestimonials = (newList: any[]) => {
    setAllTestimonials(newList);
    try {
      localStorage.setItem('lex_store_all_testimonials_v3', JSON.stringify(newList));
    } catch (err) {
      console.error('Failed to save testimonials', err);
    }
  };

  const saveMaxTestimonialsShown = (val: number) => {
    setMaxTestimonialsShown(val);
    try {
      localStorage.setItem('lex_store_max_testimonials', val.toString());
    } catch (err) {
      console.error('Failed to save max testimonials config', err);
    }
  };

  const saveMinPurchaseQty = (val: number) => {
    setMinPurchaseQty(val);
    try {
      localStorage.setItem('lex_store_min_qty_v3', val.toString());
    } catch (err) {
      console.error('Failed to save min purchase quantity', err);
    }
  };

  const saveThemeColor = (color: { r: number; g: number; b: number }) => {
    setThemeColor(color);
    try {
      localStorage.setItem('lex_store_theme_rgb_v3', JSON.stringify(color));
    } catch (err) {
      console.error('Failed to save theme color', err);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newReview = {
      name: newReviewName,
      role: '',
      rating: newReviewRating,
      avatar: '',
      commentId: newReviewComment,
      commentEn: newReviewComment,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...allTestimonials];
    saveAllTestimonials(updatedReviews);

    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);

    setReviewSuccessMessage(
      language === 'id'
        ? 'Ulasan Anda berhasil ditambahkan! Terima kasih atas dukungannya.'
        : 'Your review was successfully submitted! Thank you for your support.'
    );

    setTimeout(() => {
      setReviewSuccessMessage('');
    }, 5000);
  };

  // Load cart from localStorage on init
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('lex_store_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Failed to load cart', err);
    }
  }, []);

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [customPromos, setCustomPromos] = useState<PromoCode[]>([]);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState(false);

  // Load products and custom promos from localStorage on mount
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem('lex_store_products');
      if (savedProducts) {
        setProductsList(JSON.parse(savedProducts));
      } else {
        setProductsList(PRODUCTS);
      }
    } catch (err) {
      console.error('Failed to load products', err);
      setProductsList(PRODUCTS);
    }

    try {
      const DEFAULT_PROMOS: PromoCode[] = [
        { code: 'LEXPRO', discountAmount: 10000, isActive: true, isDefault: true },
        { code: 'BIOSKOP', discountAmount: 5000, isActive: true, isDefault: true }
      ];

      const savedPromos = localStorage.getItem('lex_store_promo_codes_v2');
      if (savedPromos) {
        setCustomPromos(JSON.parse(savedPromos));
      } else {
        // Fallback or upgrade from old format
        const oldPromos = localStorage.getItem('lex_store_promo_codes');
        if (oldPromos) {
          try {
            const parsedOld = JSON.parse(oldPromos);
            if (Array.isArray(parsedOld)) {
              const upgraded: PromoCode[] = parsedOld.map((p: any) => ({
                code: p.code,
                discountAmount: p.discount ? p.discount * 1000 : 5000,
                isActive: true
              }));
              const combined = [...DEFAULT_PROMOS, ...upgraded.filter(u => u.code !== 'LEXPRO' && u.code !== 'BIOSKOP')];
              setCustomPromos(combined);
              localStorage.setItem('lex_store_promo_codes_v2', JSON.stringify(combined));
            } else {
              setCustomPromos(DEFAULT_PROMOS);
              localStorage.setItem('lex_store_promo_codes_v2', JSON.stringify(DEFAULT_PROMOS));
            }
          } catch (e) {
            setCustomPromos(DEFAULT_PROMOS);
            localStorage.setItem('lex_store_promo_codes_v2', JSON.stringify(DEFAULT_PROMOS));
          }
        } else {
          setCustomPromos(DEFAULT_PROMOS);
          localStorage.setItem('lex_store_promo_codes_v2', JSON.stringify(DEFAULT_PROMOS));
        }
      }
    } catch (err) {
      console.error('Failed to load promos', err);
    }
  }, []);

  const saveProductsList = (newList: Product[]) => {
    setProductsList(newList);
    try {
      localStorage.setItem('lex_store_products', JSON.stringify(newList));
    } catch (err) {
      console.error('Failed to save products', err);
    }
  };

  const saveCustomPromos = (newPromos: PromoCode[]) => {
    setCustomPromos(newPromos);
    try {
      localStorage.setItem('lex_store_promo_codes_v2', JSON.stringify(newPromos));
    } catch (err) {
      console.error('Failed to save promos', err);
    }
  };

  // Save cart to localStorage on change
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem('lex_store_cart', JSON.stringify(newCart));
    } catch (err) {
      console.error('Failed to save cart', err);
    }
  };

  const handleAddToCart = (product: Product, selectedTierIndex?: number) => {
    let tierName: string | undefined = undefined;
    let tierPrice: number | undefined = undefined;

    if (product.hasTiers && product.tiers) {
      const tierIdx = selectedTierIndex !== undefined ? selectedTierIndex : 0;
      tierName = product.tiers[tierIdx].name;
      tierPrice = product.tiers[tierIdx].price;
    }

    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedTierName === tierName
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      saveCart(updated);
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        selectedTierName: tierName,
        selectedTierPrice: tierPrice,
      };
      saveCart([...cart, newItem]);
    }

    // Open cart drawer immediately for great UX feedback
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string, tierName?: string) => {
    const filtered = cart.filter(
      (item) => !(item.product.id === productId && item.selectedTierName === tierName)
    );
    saveCart(filtered);
  };

  const handleUpdateQuantity = (productId: string, tierName: string | undefined, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product.id === productId && item.selectedTierName === tierName) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    saveCart(updated);
  };

  const handleClearCart = () => {
    saveCart([]);
  };

  const handleOpenDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  // Filter products based on search and category
  const filteredProducts = productsList.filter((product) => {
    const translation = language === 'id' ? product.idTranslations : product.enTranslations;
    const matchesSearch =
      translation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displayTestimonials = allTestimonials.slice(0, maxTestimonialsShown);

  const r = themeColor.r;
  const g = themeColor.g;
  const b = themeColor.b;

  // Compute colors dynamically
  const primaryColor = `rgb(${r}, ${g}, ${b})`;
  const hoverColor = `rgb(${Math.round(r * 0.85)}, ${Math.round(g * 0.85)}, ${Math.round(b * 0.85)})`;
  const lightColor = `rgb(${r + Math.round((255-r)*0.8)}, ${g + Math.round((255-g)*0.8)}, ${b + Math.round((255-b)*0.8)})`;
  const text300Color = `rgb(${r + Math.round((255-r)*0.4)}, ${g + Math.round((255-g)*0.4)}, ${b + Math.round((255-b)*0.4)})`;
  const text400Color = `rgb(${r + Math.round((255-r)*0.2)}, ${g + Math.round((255-g)*0.2)}, ${b + Math.round((255-b)*0.2)})`;
  const darkColor = `rgb(${Math.round(r * 0.4)}, ${Math.round(g * 0.4)}, ${Math.round(b * 0.4)})`;
  const dark950Color = `rgb(${Math.round(r * 0.15)}, ${Math.round(g * 0.15)}, ${Math.round(b * 0.15)})`;
  const darkIndigo950 = `rgb(${Math.round(r * 0.1)}, ${Math.round(g * 0.1)}, ${Math.round(b * 0.1)})`;

  return (
    <div className="min-h-screen bg-black font-sans text-zinc-300 overflow-x-hidden selection:bg-violet-600 selection:text-white relative">
      {/* Ambient Background Glows & Subtle Geometric Mesh Grid */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Glow 1 - Top Left */}
        <div 
          className="absolute -top-[35%] -left-[15%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full opacity-[0.12] blur-[130px] transition-all duration-[1000ms] ease-out"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Glow 2 - Middle Right */}
        <div 
          className="absolute top-[35%] -right-[20%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full opacity-[0.08] blur-[130px] transition-all duration-[1000ms] ease-out"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Glow 3 - Bottom Left */}
        <div 
          className="absolute -bottom-[20%] left-[5%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full opacity-[0.10] blur-[120px] transition-all duration-[1000ms] ease-out"
          style={{ backgroundColor: primaryColor }}
        />
        {/* Elegant Mesh Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" 
        />
      </div>

      {/* Dynamic Theme Color Overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --color-violet-100: ${lightColor} !important;
          --color-violet-300: ${text300Color} !important;
          --color-violet-400: ${text400Color} !important;
          --color-violet-500: ${primaryColor} !important;
          --color-violet-600: ${hoverColor} !important;
          --color-violet-900: ${darkColor} !important;
          --color-violet-950: ${dark950Color} !important;
          --color-indigo-950: ${darkIndigo950} !important;
        }
        
        /* Direct class color overrides for safety */
        .selection\\:bg-violet-600::selection, .selection\\:bg-violet-600 *::selection {
          background-color: ${primaryColor} !important;
        }
        .bg-violet-600 {
          background-color: ${hoverColor} !important;
        }
        .bg-violet-500 {
          background-color: ${primaryColor} !important;
        }
        .text-violet-400 {
          color: ${primaryColor} !important;
        }
        .text-violet-300 {
          color: ${text300Color} !important;
        }
        .border-violet-500\\/20 {
          border-color: rgba(${r}, ${g}, ${b}, 0.2) !important;
        }
        .border-violet-500\\/30 {
          border-color: rgba(${r}, ${g}, ${b}, 0.3) !important;
        }
        .border-violet-500\\/50 {
          border-color: rgba(${r}, ${g}, ${b}, 0.5) !important;
        }
        .bg-violet-500\\/10 {
          background-color: rgba(${r}, ${g}, ${b}, 0.1) !important;
        }
        .shadow-violet-600\\/20 {
          --tw-shadow-color: rgba(${r}, ${g}, ${b}, 0.2) !important;
        }
        .shadow-violet-600\\/30 {
          --tw-shadow-color: rgba(${r}, ${g}, ${b}, 0.3) !important;
        }
        .shadow-violet-600\\/15 {
          --tw-shadow-color: rgba(${r}, ${g}, ${b}, 0.15) !important;
        }
        .shadow-violet-600\\/10 {
          --tw-shadow-color: rgba(${r}, ${g}, ${b}, 0.1) !important;
        }
        .shadow-violet-600\\/5 {
          --tw-shadow-color: rgba(${r}, ${g}, ${b}, 0.05) !important;
        }
        .from-violet-900 {
          --tw-gradient-from: ${darkColor} var(--tw-gradient-from-position) !important;
          --tw-gradient-to: rgba(${Math.round(r * 0.4)}, ${Math.round(g * 0.4)}, ${Math.round(b * 0.4)}, 0) var(--tw-gradient-to-position) !important;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
        }
        .via-indigo-950 {
          --tw-gradient-to: rgba(${Math.round(r * 0.1)}, ${Math.round(g * 0.1)}, ${Math.round(b * 0.1)}, 0) var(--tw-gradient-to-position) !important;
          --tw-gradient-stops: var(--tw-gradient-from), ${darkIndigo950} var(--tw-gradient-via-position), var(--tw-gradient-to) !important;
        }
      ` }} />
      {/* Top Promotion Notice Banner */}
      <div className="w-full bg-gradient-to-r from-violet-900 via-indigo-950 to-violet-900 py-2 px-4 border-b border-violet-500/20 text-center relative z-40">
        <p className="text-xs font-bold text-violet-100 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="bg-violet-500 text-white text-[9px] uppercase px-1.5 py-0.5 rounded font-black font-mono">
            LAUNCH PROMO
          </span>
          <span>
            {language === 'id'
              ? 'Gunakan kode promo LEXPRO untuk diskon 10% di keranjang belanja!'
              : 'Use code LEXPRO for 10% off in your checkout basket!'}
          </span>
        </p>
      </div>

      {/* Floating Header Navbar */}
      <header
        className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-zinc-900 shadow-lg'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-md shadow-violet-600/30">
              <span className="font-mono font-black text-lg tracking-tighter">L</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black tracking-tight text-white text-base leading-none">LEX STORE</span>
              <span className="text-[10px] text-violet-400 font-bold tracking-wider uppercase mt-0.5 font-mono">Premium Hub</span>
            </div>
          </div>

          {/* Quick Stats Banner / Center Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-400">
            <a href="#products" className="hover:text-white transition-colors">
              {language === 'id' ? 'Katalog' : 'Catalog'}
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              {language === 'id' ? 'Kelebihan' : 'Features'}
            </a>
            <a href="#channel" className="hover:text-white transition-colors">
              Channel
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          {/* Right Header Options */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Button */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/40 px-2.5 py-1.5 text-xs font-bold text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
              title="Ganti Bahasa / Switch Language"
            >
              <Icon name="Languages" size={14} />
              <span className="uppercase font-mono">{language === 'id' ? 'EN' : 'ID'}</span>
            </button>

            {/* Shopping Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-700 hover:text-white transition-colors"
            >
              <Icon name="ShoppingBag" size={16} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white ring-2 ring-black">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="pb-24">
        {/* Hero Section with Cyber Background Asset */}
        <section className="relative overflow-hidden pt-12 pb-20 md:py-28 border-b border-zinc-950">
          {/* Cyberpunk Generated Image Banner Background */}
          <div className="absolute inset-0 -z-20 flex items-center justify-center overflow-hidden">
            <img
              src="/src/assets/images/lex_store_hero_1782245826787.jpg"
              alt="Lex Store High-Tech Background"
              className="w-full h-full object-cover opacity-25"
              referrerPolicy="no-referrer"
            />
            {/* Vignette fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-transparent" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10 text-center">
            {/* Greeting and Headings */}
            <div className="space-y-4 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-400">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                {language === 'id' ? 'ADMIN AKTIF & TERPERCAYA' : 'ADMIN ACTIVE & TRUSTED'}
              </span>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-none">
                {language === 'id' ? 'Pusat Aplikasi Premium' : 'The Premium App Hub'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-violet-500">
                  LEX STORE
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                {language === 'id'
                  ? 'Temukan Fake Lag Optimizer, APK Bioskop VIP, MT Manager seumur hidup, dan layanan bimbingan personal berkualitas tinggi dengan harga termurah.'
                  : 'Get Fake Lag Optimizers, Cinema VIP APKs, MT Manager lifetime, and personal guides at the most affordable rates.'}
              </p>
            </div>

            {/* Main Action Links */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-bold text-sm px-7 py-4 shadow-lg shadow-violet-600/20 transition-all duration-200"
              >
                <Icon name="ShoppingBag" size={16} />
                {language === 'id' ? 'Lihat Katalog Aplikasi' : 'Browse Apps'}
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbBoLfsFSAt6FIgPKQ1s"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-zinc-200 font-bold text-sm px-7 py-4 transition-all duration-200"
              >
                <Icon name="MessageSquare" size={16} />
                {language === 'id' ? 'Gabung Channel WA' : 'Join WhatsApp Channel'}
              </a>
            </div>

            {/* Admin Disclaimer Line */}
            <div className="mt-10 max-w-lg mx-auto bg-zinc-900/40 border border-zinc-800/50 rounded-xl p-3">
              <p className="text-[11px] text-zinc-400 leading-normal font-medium">
                📢 {language === 'id' ? 'Beli / Chat langsung:' : 'Direct purchase via WhatsApp:'}{' '}
                <a
                  href="https://wa.me/6285880386301"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 underline font-semibold hover:text-violet-300 transition-colors ml-1"
                >
                  wa.me/6285880386301
                </a>
                <span className="block mt-1 text-zinc-500 text-[10px]">
                  {language === 'id'
                    ? 'Dapatkan akses eksklusif dengan menghubungi admin melalui link WhatsApp di atas sekarang.'
                    : 'Get exclusive access by contacting the admin via the WhatsApp link above right now.'}
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* Highlight Specifications Panels */}
        <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <StatsSection language={language} />
        </section>

        {/* Product Catalog Section */}
        <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-zinc-900">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
                {language === 'id' ? 'PRODUK PILIHAN' : 'FEATURED ITEMS'}
              </span>
              <h2 className="text-3xl font-black text-white mt-1 tracking-tight">
                {language === 'id' ? 'Katalog Aplikasi Premium' : 'Premium Application Catalog'}
              </h2>
            </div>

            {/* Filter Categories */}
            <div className="flex flex-wrap gap-1.5">
              {(['all', 'gaming', 'entertainment', 'tools', 'services'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/10'
                      : 'border border-zinc-900 bg-zinc-950/30 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'
                  }`}
                >
                  {cat === 'all' ? (language === 'id' ? 'Semua' : 'All') : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'id' ? 'Cari aplikasi premium...' : 'Search premium apps...'}
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <div className="absolute left-4 top-3.5 text-zinc-600">
              <Icon name="Search" size={16} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-zinc-500 hover:text-white"
              >
                <Icon name="X" size={14} />
              </button>
            )}
          </div>

          {/* Grid list of cards */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 border border-zinc-900 rounded-2xl bg-zinc-950/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-zinc-600 border border-zinc-800 mx-auto mb-4">
                <Icon name="Search" size={24} />
              </div>
              <p className="text-base font-bold text-zinc-400">
                {language === 'id' ? 'Aplikasi tidak ditemukan' : 'No applications found'}
              </p>
              <p className="text-xs text-zinc-600 mt-1 max-w-sm mx-auto">
                {language === 'id'
                  ? 'Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.'
                  : 'Try searching for different keywords or pick another category filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  language={language}
                  onOpenDetails={handleOpenDetails}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* WhatsApp Channel Callout Section */}
        <section id="channel" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <ChannelWidget language={language} />
        </section>

        {/* Review / Testimonials Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 overflow-hidden">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400">
              {language === 'id' ? 'ULASAN PEMBELI' : 'BUYER REVIEWS'}
            </span>
            <h2 className="text-3xl font-black text-white mt-2 tracking-tight">
              {language === 'id' ? 'Apa Kata Pelanggan Kami?' : 'What Our Buyers Say'}
            </h2>
            <p className="text-xs text-zinc-500 mt-2">
              {language === 'id'
                ? 'Geser ke kiri secara otomatis. Dekatkan kursor untuk menjeda putaran.'
                : 'Scrolls left automatically. Hover to pause the loop.'}
            </p>
          </div>

          <div className="relative w-full overflow-hidden py-4 mb-10">
            {/* Ambient gradients for premium look */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            {displayTestimonials.length === 0 ? (
              <div className="text-center py-10 border border-zinc-900 rounded-2xl bg-zinc-950/10 max-w-md mx-auto">
                <p className="text-sm font-bold text-zinc-500">
                  {language === 'id' ? 'Belum ada testimoni' : 'No testimonials found'}
                </p>
              </div>
            ) : (
              <div className="flex gap-6 animate-marquee whitespace-nowrap">
                {/* Loop 1 */}
                {displayTestimonials.map((testimonial, idx) => (
                  <div
                    key={`t1-${idx}`}
                    className="inline-block w-80 md:w-96 shrink-0 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 whitespace-normal hover:border-violet-500/20 hover:bg-zinc-950/80 transition-all duration-300"
                  >
                    <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Icon key={i} name="Star" size={12} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-zinc-300 italic mb-4 leading-relaxed line-clamp-3 min-h-[3.5rem]">
                      "{language === 'id' ? testimonial.commentId : testimonial.commentEn}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-zinc-900/60 pt-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold text-xs uppercase font-mono select-none">
                        {testimonial.name[0]}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-white text-xs truncate">
                          {maskName(testimonial.name)}
                        </h4>
                        {testimonial.date && (
                          <div className="flex items-center mt-0.5">
                            <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                              {testimonial.date}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loop 2 (Duplicate for seamless loop) */}
                {displayTestimonials.map((testimonial, idx) => (
                  <div
                    key={`t2-${idx}`}
                    className="inline-block w-80 md:w-96 shrink-0 rounded-2xl border border-zinc-900 bg-zinc-950/40 p-6 whitespace-normal hover:border-violet-500/20 hover:bg-zinc-950/80 transition-all duration-300"
                  >
                    <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Icon key={i} name="Star" size={12} fill="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs md:text-sm text-zinc-300 italic mb-4 leading-relaxed line-clamp-3 min-h-[3.5rem]">
                      "{language === 'id' ? testimonial.commentId : testimonial.commentEn}"
                    </p>
                    <div className="flex items-center gap-3 border-t border-zinc-900/60 pt-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold text-xs uppercase font-mono select-none">
                        {testimonial.name[0]}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="font-bold text-white text-xs truncate">
                          {maskName(testimonial.name)}
                        </h4>
                        {testimonial.date && (
                          <div className="flex items-center mt-0.5">
                            <span className="text-[9px] text-zinc-500 font-mono shrink-0">
                              {testimonial.date}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ulasan Form Component */}
          <div className="max-w-xl mx-auto rounded-xl border border-zinc-900 bg-zinc-950/30 p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Icon name="MessageSquare" size={18} className="text-violet-400" />
              <span>{language === 'id' ? 'Berikan Ulasan Anda' : 'Submit Your Review'}</span>
            </h3>
            <p className="text-xs text-zinc-500 mb-6">
              {language === 'id'
                ? 'Bagikan pengalaman belanja Anda di Lex Store untuk membantu calon pembeli lainnya.'
                : 'Share your experience with Lex Store to help other potential buyers.'}
            </p>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {language === 'id' ? 'Nama Anda' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  placeholder={language === 'id' ? 'Contoh: Ahmad Fauzi' : 'e.g. Ahmad Fauzi'}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {language === 'id' ? 'Rating Bintang' : 'Star Rating'}
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="text-amber-400 focus:outline-none p-0.5 hover:scale-110 transition-transform"
                    >
                      <Icon
                        name="Star"
                        size={20}
                        fill={star <= newReviewRating ? 'currentColor' : 'none'}
                        className={star <= newReviewRating ? 'text-amber-400' : 'text-zinc-600'}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-zinc-500 ml-2">
                    {newReviewRating} {language === 'id' ? 'Bintang' : 'Stars'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  {language === 'id' ? 'Isi Ulasan' : 'Review Comment'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder={
                    language === 'id'
                      ? 'Tulis ulasan Anda di sini... (Contoh: Pelayanannya mantap banget!)'
                      : 'Write your review here... (e.g. Incredibly fast service and useful files!)'
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-600/15 transition-all duration-300"
              >
                <Icon name="Send" size={14} />
                <span>{language === 'id' ? 'Kirim Ulasan' : 'Submit Review'}</span>
              </button>

              <AnimatePresence>
                {reviewSuccessMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium text-center"
                  >
                    {reviewSuccessMessage}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 scroll-mt-20">
          <FAQSection language={language} />
        </section>
      </main>

      {/* Footer Block */}
      <footer className="border-t border-zinc-900 bg-zinc-950/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-violet-600 text-white font-black text-sm">
                L
              </div>
              <span className="text-base font-black text-white tracking-tight">LEX STORE</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              {language === 'id'
                ? 'Situs terpercaya penyedia aplikasi mod premium, config sensitivitas game, dan optimasi latency terlengkap dengan jaminan kualitas terbaik.'
                : 'Your trusted hub for premium modified apps, gaming sensitivity files, and high-performance ping optimizers with guaranteed secure files.'}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {language === 'id' ? 'Kontak Kami' : 'Contact Support'}
            </h4>
            <div className="space-y-1.5">
              <a
                href="https://wa.me/6285880386301"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name="MessageCircle" size={14} className="text-emerald-500" />
                <span>WhatsApp Admin: +62 858-8038-6301</span>
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbBoLfsFSAt6FIgPKQ1s"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                <Icon name="MessageSquare" size={14} className="text-violet-400" />
                <span>Official Channel Updates</span>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {language === 'id' ? 'Slogan & Hub' : 'Slogan & Access'}
            </h4>
            <p className="text-xs text-zinc-500 leading-normal">
              {language === 'id'
                ? 'Dapatkan akses eksklusif dengan menghubungi admin melalui link WhatsApp di atas sekarang.'
                : 'Get exclusive access by contacting the admin via the WhatsApp link above right now.'}
            </p>
            <p className="text-[10px] text-zinc-600 font-mono">
              &copy; {new Date().getFullYear()} Lex Store. All Rights Reserved.
            </p>
            <button
              id="owner-portal-trigger"
              onClick={() => setIsOwnerModalOpen(true)}
              className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-zinc-950/40 px-3 py-1.5 text-[10px] font-bold text-zinc-500 hover:text-violet-400 hover:border-violet-500/20 transition-all duration-200 cursor-pointer"
            >
              <Icon name="Lock" size={10} />
              <span>{language === 'id' ? 'Akses Owner' : 'Owner Portal'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Cart Bar (For Quick Drawer Trigger) */}
      <AnimatePresence>
        {cartItemsCount > 0 && !isCartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
          >
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-6 py-3.5 shadow-xl shadow-violet-600/30 border border-violet-500/30 transition-all duration-200 active:scale-95"
            >
              <Icon name="ShoppingBag" size={16} />
              <span>
                {language === 'id'
                  ? `${cartItemsCount} Item di Keranjang`
                  : `${cartItemsCount} Items in Cart`}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer Component */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        language={language}
        onClearCart={handleClearCart}
        minPurchaseQty={minPurchaseQty}
      />

      {/* Product Details Modal Component */}
      <ProductDetailsModal
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedProduct(null);
        }}
        language={language}
        onAddToCart={handleAddToCart}
      />

      {/* Owner Control Dashboard Modal Component */}
      <OwnerDashboardModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        language={language}
        productsList={productsList}
        saveProductsList={saveProductsList}
        customPromos={customPromos}
        saveCustomPromos={saveCustomPromos}
        isOwnerAuthenticated={isOwnerAuthenticated}
        setIsOwnerAuthenticated={setIsOwnerAuthenticated}
        allTestimonials={allTestimonials}
        saveAllTestimonials={saveAllTestimonials}
        maxTestimonialsShown={maxTestimonialsShown}
        saveMaxTestimonialsShown={saveMaxTestimonialsShown}
        minPurchaseQty={minPurchaseQty}
        saveMinPurchaseQty={saveMinPurchaseQty}
        themeColor={themeColor}
        saveThemeColor={saveThemeColor}
      />
    </div>
  );
}
