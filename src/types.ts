export type AppLanguage = 'id' | 'en';

export interface ProductTranslation {
  name: string;
  tagline: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
}

export interface Product {
  id: string;
  category: 'gaming' | 'entertainment' | 'tools' | 'services';
  iconName: string;
  badge?: string;
  rating: number;
  salesCount: string;
  hasTiers?: boolean;
  selectedTierIndex?: number;
  tiers?: {
    name: string;
    price: number;
    badge?: string;
  }[];
  price: number; // default or starting price
  idTranslations: ProductTranslation;
  enTranslations: ProductTranslation;
  isOutOfStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedTierName?: string;
  selectedTierPrice?: number;
}

export interface Testimonial {
  name: string;
  role: string;
  rating: number;
  avatar: string;
  commentId: string;
  commentEn: string;
  date: string;
}

export interface FAQItem {
  questionId: string;
  questionEn: string;
  answerId: string;
  answerEn: string;
}

export interface PromoCode {
  code: string;
  discountAmount: number;
  isActive: boolean;
  isDefault?: boolean;
}

