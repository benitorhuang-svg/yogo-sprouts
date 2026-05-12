export interface Category {
  id: string;
  label: string;
}

export interface Product {
  id: number;
  category: string;
  name: string;
  price: number;
  cold: boolean;
  emoji: string;
  img?: string;
  stock: number;       // Current stock count
  spec: string;        // Product specifications
  features: string[];  // Product features/bullet points
  detailImgs?: string[]; // Slideshow images
}

export interface CartState {
  [productId: number]: number; // Quantities in cart
}

export interface Coupon {
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  minOrderAmount: number;
  expiresAt: string;
  active: boolean;
}
