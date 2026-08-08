import { UserSettings } from "@/components/settings/UserSettings";
import { Bell } from "lucide-react";

export default function ProfilePage() {
  return (
    <>
      <header className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">Profil Toko</h1>
        <div className="flex items-center space-x-4">
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition">
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 max-w-4xl mx-auto w-full">
        <UserSettings />
      </div>
    </>
  );
}
