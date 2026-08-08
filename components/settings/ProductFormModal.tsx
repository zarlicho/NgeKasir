'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Product, useProductStore } from "@/store/useProductStore";
import { Plus, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProductFormModalProps {
  mode: "add" | "edit";
  product?: Product;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ProductFormModal({ mode, product, isOpen: controlledIsOpen, onClose }: ProductFormModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProduct, updateProduct } = useProductStore();

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    image: ""
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        image: product.image || ""
      });
    } else {
      setFormData({ name: "", price: "", stock: "", category: "", image: "" });
    }
  }, [product, isOpen]);

  const handleClose = () => {
    if (isControlled && onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (mode === "add") {
        const finalImage = formData.image || '/bibimbap.png';
        await addProduct({
          name: formData.name,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          category: formData.category,
          image: finalImage
        });
      } else if (mode === "edit" && product) {
        const finalImage = formData.image || '/bibimbap.png';
        await updateProduct(product.id, {
          name: formData.name,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          category: formData.category,
          image: finalImage
        });
      }
      handleClose();
    } catch (error) {
      console.error("Failed to submit product form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {mode === "add" && !isControlled && (
        <button 
          onClick={() => setInternalIsOpen(true)} 
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Menu
        </button>
      )}

      <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden bg-transparent border-none shadow-2xl rounded-2xl md:rounded-3xl" showCloseButton={false}>
          <VisuallyHidden>
            <DialogTitle>{mode === 'edit' ? 'Edit Menu' : 'Tambah Menu Baru'}</DialogTitle>
            <DialogDescription>Isi formulir untuk menu</DialogDescription>
          </VisuallyHidden>

          <div className="bg-white rounded-2xl md:rounded-3xl w-full p-5 md:p-8 relative max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6 pr-8">{mode === 'edit' ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Nama Menu</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm" 
                  placeholder="Contoh: Nasi Goreng" 
                  required
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Snack">Snack</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Harga (Rp)</label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm" 
                    placeholder="25000" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Stok Awal</label>
                  <input 
                    type="number" 
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm" 
                    placeholder="50" 
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs md:text-sm font-semibold text-slate-700 mb-1.5 md:mb-2">Gambar Menu (Opsional)</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                  <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                    {formData.image ? (
                       <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                       <img src="/bibimbap.png" alt="Default" className="w-full h-full object-cover opacity-50" />
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setFormData({...formData, image: event.target?.result as string});
                        reader.readAsDataURL(file);
                      } else {
                        setFormData({...formData, image: ""});
                      }
                    }}
                    className="w-full text-xs md:text-sm text-slate-500 file:mr-3 file:py-2 file:px-3 md:file:px-4 file:rounded-full file:border-0 file:text-xs md:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:space-x-3 pt-2 md:pt-4">
                <button 
                  type="button" 
                  onClick={handleClose}
                  className="w-full sm:flex-1 py-2.5 md:py-3 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition text-sm md:text-base"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 py-2.5 md:py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition text-sm md:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Menu'}
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
