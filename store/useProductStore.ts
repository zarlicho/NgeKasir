import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

interface ProductStore {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  isLoading: false,
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        set({ products: data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      set({ isLoading: false });
    }
  },
  addProduct: async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        const newProduct = await res.json();
        set((state) => ({ products: [newProduct, ...state.products] }));
      }
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  },
  updateProduct: async (id, updatedFields) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields),
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? updated : p)),
        }));
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  },
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _action: 'delete' }),
      });
      if (res.ok) {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  },
}));
