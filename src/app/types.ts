export type Product = {
  id: string;
  name: string;
  profit: number;
  sales: number;
  cost: number;
  userId: string;
};

export type Weights = {
  profit: number;
  sales: number;
  cost: number;
};

export type SAWResult = {
  product: Product;
  score: number;
  rank: number;
};

export type ProductFormValues = {
  name: string;
  profit: string;
  sales: string;
  cost: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};
