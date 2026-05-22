export type OrderStatus = "Processing" | "Dispatched" | "Delivered" | "Refunded" | "Returned" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export interface Variant {
  id: string;
  label: string;
  description: string;
  price: number;
  priceDisplay: string;
  inStock: boolean;
  badge?: string;
}

export interface CartItem {
  variantId: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "admin";
  createdAt: string;
  marketingOptIn?: boolean;
  emailVerified?: boolean;
  addresses?: Address[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
  subtotal: number;
  shipping: number;
  discount: number;
  vat: number;
  total: number;
  paymentStatus: PaymentStatus;
  fulfilmentStatus: OrderStatus;
  shippingAddress: Address;
  shippingMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  body: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected" | "flagged";
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  reason: string;
  message?: string;
  status: "pending" | "item_received" | "refund_issued" | "rejected";
  createdAt: string;
  refundAmount?: number;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  source: "homepage" | "checkout" | "popup";
  status: "active" | "unsubscribed";
  createdAt: string;
}

export interface StockLog {
  id: string;
  change: number;
  reason: string;
  adminUser: string;
  resultingTotal: number;
  createdAt: string;
}
