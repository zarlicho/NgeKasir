'use client';

import { useSettingsStore } from "@/store/useSettingsStore";
import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { UploadCloud, CheckCircle2, AlertCircle, Trash2, Info } from "lucide-react";
import { parseQRIS, QRISData } from "@/lib/qris-lib";

export function GeneralSettings() {
  const { taxPercentage, setTaxPercentage, baseQris, setBaseQris } = useSettingsStore();
  const [taxInput, setTaxInput] = useState(taxPercentage.toString());
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [qrisDetails, setQrisDetails] = useState<QRISData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (baseQris) {
      try {
        const parsed = parseQRIS(baseQris);
        setQrisDetails(parsed);
      } catch (error) {
        console.error("Failed to parse QRIS data", error);
        setQrisDetails(null);
      }
    } else {
      setQrisDetails(null);
    }
  }, [baseQris]);

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxInput(e.target.value);
  };

  const handleTaxBlur = () => {
    const parsed = parseFloat(taxInput);
    if (!isNaN(parsed) && parsed >= 0) {
      setTaxPercentage(parsed);
      setTaxInput(parsed.toString());
    } else {
      setTaxInput(taxPercentage.toString());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          setUploadStatus('error');
          setErrorMessage('Gagal memproses gambar (Canvas tidak didukung).');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setBaseQris(code.data);
          setUploadStatus('success');
        } else {
          setUploadStatus('error');
          setErrorMessage('QR Code tidak terdeteksi pada gambar. Pastikan gambar jelas.');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveQris = () => {
    setBaseQris("");
    setUploadStatus('idle');
  };

  const nmid = qrisDetails?.merchantAccountInfo?.[0]?.merchantId;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8 flex flex-col md:flex-row gap-8">
      
      {/* Tax Settings */}
      <div className="flex-1 space-y-4">
        <div>
          <h2 className="font-bold text-slate-800 text-lg">Pengaturan Aplikasi</h2>
          <p className="text-sm text-slate-500">Konfigurasi dasar kasir Anda.</p>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Persentase Pajak (%)</label>
          <input 
            type="number" 
            value={taxInput}
            onChange={handleTaxChange}
            onBlur={handleTaxBlur}
            className="w-full md:w-32 px-4 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition bg-slate-50 focus:bg-white text-sm"
          />
          <p className="text-xs text-slate-500 mt-2">Pajak ini akan otomatis dihitung pada saat proses checkout.</p>
        </div>
      </div>

      {/* QRIS Upload */}
      <div className="flex-1 space-y-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 pt-6 md:pt-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Pengaturan QRIS Statis</h2>
            <p className="text-sm text-slate-500">Unggah QRIS Statis untuk dikonversi menjadi dinamis.</p>
          </div>
          {baseQris && (
            <button 
              onClick={handleRemoveQris}
              className="text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition"
              title="Hapus QRIS"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition relative overflow-hidden group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className={`w-8 h-8 mb-2 ${baseQris ? 'text-green-500' : 'text-slate-400'}`} />
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-blue-600">
                    {baseQris ? 'Ganti QRIS' : 'Klik untuk unggah'}
                  </span> atau seret file
                </p>
                <p className="text-xs text-slate-400">PNG, JPG, JPEG</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Status Feedback */}
          {uploadStatus === 'success' && !qrisDetails && (
            <div className="flex items-start p-3 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
              <CheckCircle2 className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">QRIS Berhasil Di-decode!</span>
                Data QRIS Statis Anda sudah tersimpan dan siap digunakan untuk fitur pembayaran dinamis.
              </div>
            </div>
          )}

          {/* QRIS Details Display */}
          {baseQris && qrisDetails && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4">
              <div className="flex items-center text-blue-700 font-semibold mb-3">
                <Info className="w-4 h-4 mr-2" />
                Detail QRIS Aktif
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Merchant</span>
                  <span className="font-medium text-slate-800 text-right">{qrisDetails.merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NMID</span>
                  <span className="font-medium text-slate-800 text-right">{nmid || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kota</span>
                  <span className="font-medium text-slate-800 text-right">{qrisDetails.merchantCity}</span>
                </div>
              </div>
            </div>
          )}

          {uploadStatus === 'error' && (
            <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Gagal Membaca QRIS</span>
                {errorMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
