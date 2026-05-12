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
    stock: number;
    spec: string;
    features: string[];
    detailImgs?: string[];
}
export interface CartState {
    [productId: number]: number;
}
export interface Coupon {
    code: string;
    type: 'fixed' | 'percent';
    value: number;
    minOrderAmount: number;
    expiresAt: string;
    active: boolean;
}
