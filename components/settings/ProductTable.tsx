'use client';

import { useProductStore } from "@/store/useProductStore";
import { Edit, Trash2 } from "lucide-react";
import { ProductFormModal } from "./ProductFormModal";
import { useEffect, useState } from "react";

export function ProductTable() {
  const { products, deleteProduct, fetchProducts } = useProductStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const getStockStatus = (stock: number) => {
    if (stock > 20) return { label: "Aman", class: "bg-green-100 text-green-700" };
    if (stock > 0) return { label: "Menipis", class: "bg-orange-100 text-orange-700" };
    return { label: "Habis", class: "bg-red-100 text-red-700" };
  };

  return (
    <>
      <div className="flex flex-col gap-4 p-4 md:p-6 max-w-6xl mx-auto">
        {products.map((product) => {
          const status = getStockStatus(product.stock);
          
          return (
            <div key={product.id} className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl p-3 md:p-4 flex flex-row items-center hover:shadow-xl hover:shadow-slate-200/50 transition-all gap-3 md:gap-5">
              
              {/* Image */}
              <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-slate-100 relative rounded-xl md:rounded-2xl overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl md:text-4xl">☕</div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 min-w-0 py-1">
                <h3 className="font-bold text-slate-800 text-[13px] md:text-lg leading-tight truncate mb-0.5 md:mb-1">{product.name}</h3>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 md:mb-3 truncate">{product.category}</p>
                
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mt-auto">
                  <span className="font-bold text-slate-900 text-xs md:text-base">Rp {product.price.toLocaleString('id-ID')}</span>
                  
                  <div className="hidden md:block w-1 h-1 bg-slate-300 rounded-full"></div>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold rounded-lg border w-fit ${status.class.replace('bg-', 'bg-opacity-10 text-').replace('text-', 'border-')}`}>
                    {status.label} • Sisa {product.stock}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 shrink-0 border-l border-slate-100 pl-3 md:pl-5 ml-1 md:ml-2">
                <button 
                  onClick={() => setEditingId(product.id)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Edit className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button 
                  onClick={() => deleteProduct(product.id)}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {editingId && (
        <ProductFormModal 
          mode="edit" 
          product={products.find(p => p.id === editingId)} 
          isOpen={true}
          onClose={() => setEditingId(null)}
        />
      )}
    </>
  );
}
