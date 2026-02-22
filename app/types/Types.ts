export interface Transaction {
  id: string;
  created_at: string;
  category_id: number;
  type_id: number;
  user_id: number;
  value: number;
}

export interface TransactionType {
  id: number;
  uid: number;
  value: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  ownerId: number;
  category: string;
}
