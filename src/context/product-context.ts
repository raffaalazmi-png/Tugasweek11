import { createContext, useContext } from "react";
import type { Product } from "../types/product";

export type ProductInput = {
  name: string;
  price: number;
};

export type ProductContextValue = {
  products: Product[];
  isLoading: boolean;
  error: string;
  message: string;
  loadFromApi: () => Promise<void>;
  addProduct: (input: ProductInput) => void;
  updateProduct: (id: number, input: ProductInput) => void;
  deleteProduct: (id: number) => void;
};

export const ProductContext = createContext<ProductContextValue | null>(null);

export function useProducts(): ProductContextValue {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts harus digunakan di dalam ProductProvider.");
  }
  return context;
}
