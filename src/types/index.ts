export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  isActive?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category: Category | string;
  image?: string;
  isActive?: boolean;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}