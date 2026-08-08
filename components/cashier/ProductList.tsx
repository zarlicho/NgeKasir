'use client';

import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { Plus, Star, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export function ProductList() {
  const { products, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();
  const [category, setCategory] = useState("Semua");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = ["Semua", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    return category === "Semua" || p.category === category;
  });

  return (
    <>
      <div className="p-4 flex space-x-3 overflow-x-auto hide-scrollbar bg-slate-50/50">
        <button className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-sm shrink-0 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition shadow-sm border ${
              category === c
                ? "bg-slate-800 border-slate-800 text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/50">
        <div className="p-4 md:p-6 pb-28 lg:pb-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              onClick={() => addItem(product)}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group flex flex-col p-2.5"
            >
              <div className="aspect-[4/3] w-full shrink-0 overflow-hidden relative rounded-2xl bg-slate-100">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">☕</span>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-md hover:bg-black/40 w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>

                {/* Stock Indicator */}
                <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm border border-white/20">
                  <p className="text-[10px] font-bold text-slate-700">Sisa {product.stock}</p>
                </div>
              </div>
              
              <div className="pt-3 pb-1 px-1.5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-bold text-slate-800 text-[13px] md:text-sm leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center text-[11px] md:text-xs font-bold text-slate-600 shrink-0 mt-0.5">
                    <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-red-500 fill-red-500 mr-1" />
                    4.9
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] md:text-[11px] font-medium text-slate-500 line-clamp-1 mr-2">{product.category}</span>
                  <span className="font-bold text-slate-900 text-[13px] md:text-sm whitespace-nowrap">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
