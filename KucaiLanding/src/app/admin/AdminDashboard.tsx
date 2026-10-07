"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { type Account, type Testimonial, type Reputation, supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, MessageSquare, Star, LogOut, Menu, Search, Bell, Settings, ShoppingCart, Database, Package, User, Palette, Headphones, ImagePlus, X, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Swal from "sweetalert2";

async function adminApi(action: string, data?: any) {
  const res = await fetch("/api/admin/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });
  return res.json();
}

async function adminUpload(file: File, folder: string): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const result = await res.json();
  return result.url || null;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "testimonials" | "reputations" | "settings" | "orders_buy" | "orders_sell" | "stock" | "products" | "profile" | "theme" | "livechat">("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0c0805] text-white/90 font-sans">
      {/* HEADER DESKTOP */}
      <header className="fixed top-0 left-0 right-0 h-[75px] bg-[#140e0b] shadow-[0_4px_20px_rgba(0,0,0,0.3)] z-40 flex items-center justify-between px-4 lg:px-8 transition-all duration-300 ml-0 lg:ml-72">
        <div className="flex items-center gap-4">
          <button suppressHydrationWarning className="lg:hidden p-2 text-white/70" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center bg-[#1a120e] rounded-lg px-3 py-2 w-64 border border-amber-900/30">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input suppressHydrationWarning type="text" placeholder="Search for data & reports..." className="bg-transparent border-none outline-none text-sm w-full text-white/80" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button suppressHydrationWarning className="relative text-white/50 hover:text-amber-500">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 border-l pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-white/90">Admin</p>
              <p className="text-xs text-white/50">Superadmin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-[#140e0b] border-r border-amber-900/30 z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="h-[75px] shrink-0 flex items-center justify-center border-b border-amber-900/20 px-8">
          <h1 className="text-2xl font-black text-amber-500 tracking-tight flex items-center gap-2">
            Kucai<span className="text-white/90 font-normal">DL</span>
          </h1>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </li>

            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("testimonials")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'testimonials' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <Star className="w-5 h-5" /> Testimonials
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("reputations")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'reputations' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <MessageSquare className="w-5 h-5" /> Reputations
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <Settings className="w-5 h-5" /> Settings (Prices)
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("orders_buy")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders_buy' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <ShoppingCart className="w-5 h-5" /> Menu Buy (Beli)
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("orders_sell")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders_sell' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <ShoppingCart className="w-5 h-5" /> Menu Sell (Jual)
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("stock")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'stock' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <Database className="w-5 h-5" /> Digital Stock
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <Package className="w-5 h-5" /> Digital Products
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <User className="w-5 h-5" /> Pengaturan Profile
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("theme")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'theme' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <Palette className="w-5 h-5" /> Website Theme
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("livechat")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'livechat' ? 'text-amber-500 bg-amber-500/10' : 'text-white/70 hover:text-amber-500 hover:bg-[#0c0805]'}`}
              >
                <Headphones className="w-5 h-5" /> Live Chat
              </button>
            </li>
          </ul>
          <hr className="my-6 border-amber-900/20" />
          <button suppressHydrationWarning 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
        <div className="p-5 border-t border-amber-900/20 text-center shrink-0">
          <p className="text-[12px] text-gray-400 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} KUCAIDL.<br/>
            Created with <span className="text-red-500">❤️</span> By <strong className="text-white/50">VannessWangsaff</strong>
          </p>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main className="pt-[75px] lg:pl-72 transition-all duration-300 min-h-screen">
        <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
          {/* Breadcrumb / Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white/90 capitalize mb-1">Manage {activeTab}</h2>
            <p className="text-sm text-white/50">Overview & statistics</p>
          </div>

          <div className="space-y-6">
            {activeTab === "dashboard" && <DashboardOverview />}

            {activeTab === "testimonials" && <ManageTestimonials />}
            {activeTab === "reputations" && <ManageReputations />}
            {activeTab === "settings" && <ManageSettings />}
            {activeTab === "orders_buy" && <ManageOrders mode="buy" />}
            {activeTab === "orders_sell" && <ManageOrders mode="sell" />}
            {activeTab === "stock" && <ManageStock />}
            {activeTab === "products" && <ManageProducts />}
            {activeTab === "profile" && <ManageProfile />}
            {activeTab === "theme" && <ManageTheme />}
            {activeTab === "livechat" && <ManageLiveChat />}
          </div>
          
          <footer className="mt-12 pb-4">
          </footer>
        </div>
      </main>
    </div>
  );
}

function DashboardOverview() {
  const [stats, setStats] = useState({ accounts: 0, testimonials: 0, bglRate: 0, dlRate: 0, visitors: 0 });

  useEffect(() => {
    async function fetchData() {
      const result = await adminApi("fetchDashboardStats");
      if (!result.error) {
        setStats({
          accounts: result.accounts || 0,
          testimonials: result.testimonials || 0,
          bglRate: result.bglRate || 0,
          dlRate: result.dlRate || 0,
          visitors: result.visitors || 0,
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Pengunjung Web */}
      <div className="bg-[#140e0b] p-6 rounded-xl border border-amber-900/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center gap-4">
        <div className="bg-amber-500/10 text-amber-500 p-4 rounded-lg"><LayoutDashboard className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-white/50 font-medium">Pengunjung Web</p>
          <h4 className="text-2xl font-bold text-white/90">{stats.visitors.toLocaleString('id-ID')}</h4>
        </div>
      </div>
      

      
      {/* Jumlah Testimoni */}
      <div className="bg-[#140e0b] p-6 rounded-xl border border-amber-900/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center gap-4">
        <div className="bg-amber-50 text-amber-600 p-4 rounded-lg"><Star className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-white/50 font-medium">Jumlah Testimoni</p>
          <h4 className="text-2xl font-bold text-white/90">{stats.testimonials}</h4>
        </div>
      </div>
      
      {/* Rate BGL */}
      <div className="bg-[#140e0b] p-6 rounded-xl border border-amber-900/20 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center gap-4">
        <div className="bg-purple-50 text-purple-600 p-4 rounded-lg"><MessageSquare className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-white/50 font-medium">Rate BGL / DL</p>
          <h4 className="text-[17px] font-bold text-white/90">
            Rp {stats.bglRate.toLocaleString('id-ID')} / Rp {stats.dlRate.toLocaleString('id-ID')}
          </h4>
        </div>
      </div>
    </div>
  );
}

function ManageAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchAccounts = async () => {
    const result = await adminApi("fetchAccounts");
    if (result.data) setAccounts(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    if (imageFile) {
      const uploadedUrl = await adminUpload(imageFile, "accounts");
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        alert("Gagal upload gambar");
        return;
      }
    }

    await adminApi("addAccount", {
      title,
      price: Number(price),
      description,
      image_url: finalImageUrl,
    });
    setTitle(""); setPrice(""); setDescription(""); setImageUrl(""); setImageFile(null);
    fetchAccounts();
  };

  const handleDelete = async (id: number) => {
    await adminApi("deleteAccount", { id });
    fetchAccounts();
  };

  return (
    <>
      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Add New Account</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Title</label>
            <input suppressHydrationWarning value={title} onChange={e=>setTitle(e.target.value)} required className="w-full border border-amber-900/50 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Price (IDR)</label>
            <input suppressHydrationWarning type="number" value={price} onChange={e=>setPrice(e.target.value)} required className="w-full border border-amber-900/50 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Image (Upload File)</label>
            <input suppressHydrationWarning type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} className="w-full border border-amber-900/50 p-[7px] rounded text-sm text-white/90 bg-[#140e0b]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
            <input suppressHydrationWarning value={description} onChange={e=>setDescription(e.target.value)} className="w-full border border-amber-900/50 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-amber-600 transition-colors font-medium text-sm">Submit Form</button>
          </div>
        </form>
      </div>

      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Accounts Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-[#0c0805] text-xs text-white/80 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : accounts.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-4 text-center">No data available in table</td></tr>
              ) : (
                accounts.map(acc => (
                  <tr key={acc.id} className="border-b border-gray-50 hover:bg-[#0c0805]/50">
                    <td className="px-6 py-4 font-medium text-gray-900">{acc.title}</td>
                    <td className="px-6 py-4">Rp {acc.price.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">{acc.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button suppressHydrationWarning onClick={() => handleDelete(acc.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchTestimonials = async () => {
    const result = await adminApi("fetchTestimonials");
    if (result.data) setTestimonials(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalImageUrl = imageUrl;

    if (imageFile) {
      const uploadedUrl = await adminUpload(imageFile, "testimonials");
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      } else {
        alert("Gagal upload gambar");
        return;
      }
    }

    await adminApi("addTestimonial", { image_url: finalImageUrl });
    setImageUrl(""); setImageFile(null);
    fetchTestimonials();
  };

  const handleDelete = async (id: number) => {
    await adminApi("deleteTestimonial", { id });
    fetchTestimonials();
  };

  return (
    <>
      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Add Testimonial</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Screenshot (Upload File)</label>
            <input suppressHydrationWarning type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} required className="w-full border border-amber-900/50 p-[7px] rounded text-sm text-white/90 bg-[#140e0b]" />
          </div>
          <div>
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-amber-600 transition-colors font-medium text-sm">Submit Testimonial</button>
          </div>
        </form>
      </div>

      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Testimonials Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/70">
            <thead className="bg-[#0c0805] text-xs text-white/80 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="px-6 py-4 text-center">Loading...</td></tr>
              ) : testimonials.length === 0 ? (
                <tr><td colSpan={2} className="px-6 py-4 text-center">No data available in table</td></tr>
              ) : (
                testimonials.map(t => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-[#0c0805]/50">
                    <td className="px-6 py-4">
                      {t.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <a href={t.image_url} target="_blank" rel="noreferrer">
                          <img src={t.image_url} alt="" className="w-12 h-12 object-cover rounded shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/30" />
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button suppressHydrationWarning onClick={() => handleDelete(t.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ManageReputations() {
  const [reputations, setReputations] = useState<Reputation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReputations = async () => {
    const result = await adminApi("fetchReputations");
    if (result.data) setReputations(result.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReputations();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await adminApi("updateReputationStatus", { id, status });
    fetchReputations();
  };

  const handleDelete = async (id: number) => {
    await adminApi("deleteReputation", { id });
    fetchReputations();
  };

  return (
    <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-amber-900/20">
        <h3 className="text-lg font-semibold text-white/90">Reputations Data Table</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-white/70">
          <thead className="bg-[#0c0805] text-xs text-white/80 uppercase">
            <tr>
              <th className="px-6 py-3 font-medium">Buyer</th>
              <th className="px-6 py-3 font-medium">Message</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">Loading...</td></tr>
            ) : reputations.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center">No data available in table</td></tr>
            ) : (
              reputations.map(rep => (
                <tr key={rep.id} className="border-b border-gray-50 hover:bg-[#0c0805]/50">
                  <td className="px-6 py-4 font-medium text-gray-900">{rep.buyer_name}</td>
                  <td className="px-6 py-4 max-w-[200px] truncate">{rep.message}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      rep.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      rep.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    {rep.status !== 'approved' && (
                      <button suppressHydrationWarning onClick={() => updateStatus(rep.id, 'approved')} className="bg-green-500 text-white px-2 py-1.5 rounded text-xs hover:bg-green-600 transition-colors">Approve</button>
                    )}
                    {rep.status !== 'rejected' && (
                      <button suppressHydrationWarning onClick={() => updateStatus(rep.id, 'rejected')} className="bg-yellow-500 text-white px-2 py-1.5 rounded text-xs hover:bg-yellow-600 transition-colors">Reject</button>
                    )}
                    <button suppressHydrationWarning onClick={() => handleDelete(rep.id)} className="bg-red-500 text-white px-2 py-1.5 rounded text-xs hover:bg-red-600 transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageSettings() {
  const [buyBgl, setBuyBgl] = useState("");
  const [buyDl, setBuyDl] = useState("");
  const [sellBgl, setSellBgl] = useState("");
  
  const [waKucaidl, setWaKucaidl] = useState("");
  const [waKucaiakun, setWaKucaiakun] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await adminApi("fetchSettings");
      if (result.error) { setLoading(false); return; }

      const { products: pData, settings: sData, siteSettings: siteData } = result;

      if (pData) {
        const bgl = pData.find((p: any) => p.type === "bgl");
        const dl = pData.find((p: any) => p.type === "dl");
        if (bgl) setBuyBgl(bgl.price.toString());
        if (dl) setBuyDl(dl.price.toString());
      }

      if (sData) {
        const configRow = sData.find((s: any) => s.key === "config");
        if (configRow?.value) {
          try {
            const parsed = JSON.parse(configRow.value);
            if (parsed.sellRate) setSellBgl(parsed.sellRate.toString());
          } catch {}
        }
      }

      if (siteData) {
        const kucaidl = siteData.find((s: any) => s.key === "wa_kucaidl");
        const kucaiakun = siteData.find((s: any) => s.key === "wa_kucaiakun");
        if (kucaidl) setWaKucaidl(kucaidl.value);
        if (kucaiakun) setWaKucaiakun(kucaiakun.value);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await adminApi("saveSettings", {
        buyBgl, buyDl, sellBgl, waKucaidl, waKucaiakun,
      });

      if (result.error) throw new Error(result.error);

      Swal.fire({
        title: "Berhasil!",
        text: "Pengaturan berhasil diperbarui.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
    } catch (err: any) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal memperbarui: " + err.message,
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
      <div className="px-6 py-4 border-b border-amber-900/20">
        <h3 className="text-lg font-semibold text-white/90">Manage Settings</h3>
      </div>
      <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Buy Price (BGL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/50 text-sm">Rp</span>
            <input suppressHydrationWarning type="number" value={buyBgl} onChange={e=>setBuyBgl(e.target.value)} required className="w-full border border-amber-900/50 pl-10 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
          </div>
          <p className="text-xs text-white/50 mt-1">Harga Beli User (Harga Jual Anda)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Buy Price (DL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/50 text-sm">Rp</span>
            <input suppressHydrationWarning type="number" value={buyDl} onChange={e=>setBuyDl(e.target.value)} required className="w-full border border-amber-900/50 pl-10 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
          </div>
          <p className="text-xs text-white/50 mt-1">Harga Beli DL User (Harga Jual Anda)</p>
        </div>
        <div className="md:col-span-2 border-t border-amber-900/20 pt-4">
          <label className="block text-sm font-medium text-white/70 mb-1">Sell Price (BGL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-white/50 text-sm">Rp</span>
            <input suppressHydrationWarning type="number" value={sellBgl} onChange={e=>setSellBgl(e.target.value)} required className="w-full border border-amber-900/50 pl-10 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" />
          </div>
          <p className="text-xs text-white/50 mt-1">Harga Jual User (Harga Beli Anda). DL Sell Price otomatis: Rp {sellBgl ? Math.floor(Number(sellBgl)/100).toLocaleString('id-ID') : 0}</p>
        </div>

        <div className="md:col-span-2 border-t border-amber-900/20 pt-4">
          <h4 className="font-semibold text-white/80 mb-4">Pengaturan WhatsApp</h4>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp KUCAIDL</label>
          <input suppressHydrationWarning type="text" value={waKucaidl} onChange={e=>setWaKucaidl(e.target.value)} required className="w-full border border-amber-900/50 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="628..." />
          <p className="text-xs text-white/50 mt-1">Nomor untuk transaksi DL/BGL (Format: 628...)</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp KucaiAkun</label>
          <input suppressHydrationWarning type="text" value={waKucaiakun} onChange={e=>setWaKucaiakun(e.target.value)} required className="w-full border border-amber-900/50 p-2.5 rounded text-sm text-white/90 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="628..." />
          <p className="text-xs text-white/50 mt-1">Nomor untuk transaksi Jual/Beli Akun (Format: 628...)</p>
        </div>

        <div className="md:col-span-2 mt-2">
          <button suppressHydrationWarning type="submit" disabled={saving} className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-amber-600 transition-colors font-medium text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ManageOrders({ mode }: { mode: 'buy' | 'sell' }) {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("Menunggu dicek");

  useEffect(() => {
    async function fetchProofs() {
      const { data } = await supabase
        .from("chat_messages")
        .select(`*, chat_sessions(customer_name)`)
        .eq("sender", "customer")
        .not("image_url", "is", null)
        .order("created_at", { ascending: false });
      
      if (data) {
        // Filter out buy/sell based on message content
        // Sell mode uploads are empty text (auto-submitted)
        // Buy mode uploads have caption
        const filtered = data.filter(msg => {
          if (mode === "sell") {
            return !msg.message || msg.message.trim() === "";
          } else {
            return msg.message && msg.message.trim() !== "";
          }
        });
        setProofs(filtered);
      }
      setLoading(false);
    }
    fetchProofs();
  }, [mode]);

  return (
    <div className="space-y-6">
      <div className="flex bg-[#140e0b] p-1.5 rounded-xl border border-amber-900/20 max-w-2xl mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        {["Menunggu dicek", "Riwayat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
              activeSubTab === tab ? "bg-[#1f1611] text-amber-500 shadow-sm border border-amber-900/30" : "text-gray-400 hover:text-white"
            }`}
          >
            {tab} {tab === "Menunggu dicek" && <span className="ml-1 px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full text-xs">{proofs.length}</span>}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-white/50 text-center col-span-full py-10">Memuat data order...</p>
        ) : (
          proofs.map((proof) => (
            <div key={proof.id} className="bg-[#140e0b] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-amber-900/20 overflow-hidden flex flex-col group hover:border-amber-500/50 transition-colors">
              <div className="p-4 bg-white/5 border-b border-amber-900/20 relative">
                <img 
                  src={proof.image_url} 
                  alt="Bukti TF" 
                  className="w-full h-48 object-cover rounded-xl border border-white/10 cursor-pointer group-hover:scale-[1.02] transition-transform" 
                  onClick={() => window.open(proof.image_url, '_blank')} 
                />
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-lg truncate pr-2">{proof.chat_sessions?.customer_name || 'Tamu'}</h4>
                  <span className="shrink-0 px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    BARU
                  </span>
                </div>
                <div className="text-sm text-gray-300 whitespace-pre-wrap bg-black/40 p-4 rounded-xl border border-white/5 font-mono shadow-inner flex-1">
                  {proof.message || "Tidak ada detail text."}
                </div>
                <div className="mt-2 pt-4 border-t border-white/5 text-xs text-gray-500 flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-amber-500/70" /> Chat
                  </span>
                  <span>{new Date(proof.created_at).toLocaleString("id-ID", { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          ))
        )}
        {!loading && proofs.length === 0 && (
           <p className="text-white/50 text-center col-span-full py-10">Belum ada order masuk.</p>
        )}
      </div>
    </div>
  );
}
const CustomSelect = ({ value, onChange, options, className }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[], className?: string }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const selectedLabel = options.find(o => String(o.value) === String(value))?.label || "Pilih...";

  const handleOpen = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
    setOpen(!open);
  };
  
  return (
    <div className={`relative ${className || ""}`}>
      <div 
        ref={triggerRef}
        onClick={handleOpen}
        className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors cursor-pointer flex justify-between items-center bg-[#140e0b]"
      >
        <span className="truncate">{selectedLabel}</span>
        <span className={`text-[10px] ml-2 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)}></div>
          <div 
            className="fixed bg-[#1a120e] border border-amber-900/50 rounded-lg shadow-2xl z-[9999] max-h-72 overflow-y-auto"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            {options.map(opt => (
              <div 
                key={opt.value} 
                className={`p-2.5 text-sm cursor-pointer hover:bg-amber-600 transition-colors ${String(value) === String(opt.value) ? 'bg-amber-600 text-white' : 'text-white/90'}`}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function ManageStock() {
  const [stock, setStock] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [productId, setProductId] = useState("");
  const [credentials, setCredentials] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const sRes = await fetch("/api/admin/ecommerce", { method: "POST", body: JSON.stringify({ action: "fetchStock" }) });
    const sData = await sRes.json();
    if (sData.data) setStock(sData.data);

    const pRes = await fetch("/api/admin/ecommerce", { method: "POST", body: JSON.stringify({ action: "fetchDigitalProducts" }) });
    const pData = await pRes.json();
    if (pData.data) {
      setProducts(pData.data);
      if (pData.data.length > 0) setProductId(pData.data[0].id.toString());
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/ecommerce", { method: "POST", body: JSON.stringify({ action: "addStock", data: { product_id: Number(productId), credentials_data: credentials } }) });
    setCredentials("");
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/admin/ecommerce", { method: "POST", body: JSON.stringify({ action: "deleteStock", data: { id } }) });
    fetchData();
  };

  return (
    <>
      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Tambah Stok Akun Digital</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Pilih Produk</label>
            <CustomSelect 
              value={productId} 
              onChange={setProductId} 
              options={products.map(p => ({ value: p.id.toString(), label: p.title }))} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Data Akun (Email / Pass dll)</label>
            <input suppressHydrationWarning value={credentials} onChange={e=>setCredentials(e.target.value)} required className="w-full border border-amber-900/50 p-2.5 rounded text-sm text-white/90" placeholder="Email: xxx | Pass: yyy" />
          </div>
          <div className="md:col-span-2">
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-amber-600 transition-colors font-medium text-sm">Tambah Stok</button>
          </div>
        </form>
      </div>

      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0c0805] text-white/70">
              <tr>
                <th className="px-6 py-3 font-medium">Produk</th>
                <th className="px-6 py-3 font-medium">Data Akun</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : stock.map(s => (
                <tr key={s.id} className="hover:bg-[#0c0805]">
                  <td className="px-6 py-4">{s.digital_products?.title}</td>
                  <td className="px-6 py-4 font-mono text-xs">{s.credentials_data}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${s.is_sold ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {s.is_sold ? 'TERJUAL' : 'TERSEDIA'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button suppressHydrationWarning onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ManageProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [category, setCategory] = useState("AKUN");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [icon, setIcon] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Edit modal state
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editCategory, setEditCategory] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("/api/admin/ecommerce", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "fetchDigitalProducts" }) });
    const data = await res.json();
    if (data.data) setProducts(data.data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = icon;
      if (imageFile) {
        const uploadedUrl = await adminUpload(imageFile, "products");
        if (uploadedUrl) finalImageUrl = uploadedUrl;
        else { Swal.fire("Error", "Gagal upload gambar produk.", "error"); return; }
      }
      const res = await fetch("/api/admin/ecommerce", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "addDigitalProduct", 
          data: { category, title, description, price: Number(price), icon: finalImageUrl } 
        }) 
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: `Produk "${title}" berhasil ditambahkan.`, timer: 2000, showConfirmButton: false });
        setTitle(""); setDescription(""); setPrice(""); setIcon(""); setImageFile(null);
        fetchProducts();
      } else {
        Swal.fire("Error", result.error || "Gagal menambahkan produk.", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Terjadi kesalahan.", "error");
    }
  };

  const openEdit = (product: any) => {
    setEditProduct(product);
    setEditCategory(product.category || "AKUN");
    setEditTitle(product.title || "");
    setEditDesc(product.description || "");
    setEditPrice(String(product.price || ""));
    setEditIcon(product.icon || "");
    setEditImageFile(null);
  };

  const handleEditSave = async () => {
    setSaving(true);
    try {
      let finalIcon = editIcon;
      if (editImageFile) {
        const uploadedUrl = await adminUpload(editImageFile, "products");
        if (uploadedUrl) finalIcon = uploadedUrl;
        else { Swal.fire("Error", "Gagal upload gambar.", "error"); setSaving(false); return; }
      }
      const res = await fetch("/api/admin/ecommerce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateDigitalProduct",
          data: { id: editProduct.id, category: editCategory, title: editTitle, description: editDesc, price: Number(editPrice), icon: finalIcon },
        }),
      });
      const result = await res.json();
      if (result.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Produk berhasil diperbarui.", timer: 1500, showConfirmButton: false });
        setEditProduct(null);
        fetchProducts();
      } else {
        Swal.fire("Error", result.error || "Gagal memperbarui produk.", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message || "Terjadi kesalahan.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({ title: "Hapus Produk?", text: "Semua stok terkait juga akan terhapus.", icon: "warning", showCancelButton: true, confirmButtonColor: "#ef4444", confirmButtonText: "Ya, Hapus!" });
    if (!confirm.isConfirmed) return;
    const res = await fetch("/api/admin/ecommerce", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "deleteDigitalProduct", data: { id } }) });
    const result = await res.json();
    if (result.success) {
      Swal.fire({ icon: "success", title: "Terhapus!", timer: 1500, showConfirmButton: false });
      fetchProducts();
    } else {
      Swal.fire("Error", result.error || "Gagal menghapus produk.", "error");
    }
  };

  const inputClass = "w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors";

  return (
    <>
      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Add New Digital Product</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Category</label>
            <CustomSelect 
              value={category} 
              onChange={setCategory} 
              options={[{value:"AKUN",label:"AKUN"}, {value:"LAYANAN",label:"LAYANAN"}, {value:"ITEM",label:"ITEM / DLL"}]} 
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Title (Product Name)</label>
            <input suppressHydrationWarning value={title} onChange={e=>setTitle(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Price (IDR)</label>
            <input suppressHydrationWarning type="number" value={price} onChange={e=>setPrice(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Product Image (Upload)</label>
            <input suppressHydrationWarning type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} className={inputClass + " p-[7px] bg-[#140e0b]"} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/70 mb-1">Description</label>
            <textarea suppressHydrationWarning rows={3} value={description} onChange={e=>setDescription(e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-amber-600 transition-colors font-medium text-sm">Create Product</button>
          </div>
        </form>
      </div>

      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0c0805] text-white/70">
              <tr>
                <th className="px-6 py-3 font-medium">Kategori</th>
                <th className="px-6 py-3 font-medium">Judul Produk</th>
                <th className="px-6 py-3 font-medium">Harga</th>
                <th className="px-6 py-3 font-medium">Icon</th>
                <th className="px-6 py-3 font-medium w-36">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : products.map(p => (
                <tr key={p.id} className="hover:bg-[#0c0805]">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-[#1a120e] text-white/70 text-xs font-bold rounded">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white/90">{p.title}</td>
                  <td className="px-6 py-4 text-emerald-600 font-mono font-bold">Rp {p.price.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4">
                    {p.icon && p.icon.startsWith("http") ? (
                      <img src={p.icon} alt={p.title} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-white/50 text-xs">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button suppressHydrationWarning onClick={() => openEdit(p)} className="text-amber-400 hover:text-blue-700 text-xs font-medium bg-amber-500/10 hover:bg-amber-900/40 px-3 py-1.5 rounded transition-colors">Edit</button>
                      <button suppressHydrationWarning onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setEditProduct(null)}>
          <div 
            className="bg-[#140e0b] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20 sticky top-0 bg-[#140e0b] rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-white/90">Edit Produk</h3>
              <button onClick={() => setEditProduct(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1a120e] text-gray-400 hover:text-white/70 transition-colors text-xl">&times;</button>
            </div>
            
            <div className="p-6 space-y-4">
              {editIcon && editIcon.startsWith("http") && (
                <div className="flex justify-center">
                  <img src={editIcon} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-amber-900/30" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Kategori</label>
                <CustomSelect 
                  value={editCategory} 
                  onChange={setEditCategory} 
                  options={[{value:"AKUN",label:"AKUN"}, {value:"LAYANAN",label:"LAYANAN"}, {value:"ITEM",label:"ITEM / DLL"}]} 
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Judul Produk</label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Harga (IDR)</label>
                <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Deskripsi</label>
                <textarea rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Ganti Gambar (Upload)</label>
                <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files?.[0] || null)} className={inputClass + " p-[7px] bg-[#140e0b]"} />
                <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti gambar.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-amber-900/20 bg-[#0c0805] rounded-b-2xl sticky bottom-0">
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 bg-[#4272d7] hover:bg-amber-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                onClick={() => setEditProduct(null)}
                className="px-5 py-2.5 border border-amber-900/50 text-white/70 hover:bg-[#1a120e] font-medium rounded-lg transition-colors text-sm"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ManageProfile() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getSessions" })
      });
      const data = await res.json();
      if (data.success) {
        setSessions(data.data);
        setCurrentSession(data.currentSession);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateCredentials",
          data: { username, password }
        })
      });
      const data = await res.json();
      if (data.success) {
        Swal.fire("Berhasil", "Username dan Password berhasil diubah. Silakan gunakan kredensial baru untuk login selanjutnya.", "success");
        setUsername("");
        setPassword("");
      } else {
        Swal.fire("Error", data.error || "Gagal mengubah profil", "error");
      }
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    }
  };

  const handleRevoke = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Logout Perangkat?",
      text: "Perangkat ini akan dipaksa keluar dari dashboard.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Logout!",
      confirmButtonColor: "#ef4444"
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/admin/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "revokeSession",
          data: { id }
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchSessions();
      } else {
        Swal.fire("Error", data.error || "Gagal", "error");
      }
    } catch (e: any) {
      Swal.fire("Error", e.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Ubah Kredensial Login</h3>
          <p className="text-sm text-white/50">Ubah username dan password untuk keamanan akun Anda.</p>
        </div>
        <form onSubmit={handleUpdateCredentials} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Username Baru</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
              className="w-full md:w-1/2 border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm outline-none transition-colors" 
              placeholder="Masukkan username baru..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Password Baru</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full md:w-1/2 border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm outline-none transition-colors" 
              placeholder="Masukkan password baru..."
            />
          </div>
          <button type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:bg-amber-600 transition-colors text-sm font-medium">
            Simpan Perubahan
          </button>
        </form>
      </div>

      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Perangkat Aktif (Sesi)</h3>
          <p className="text-sm text-white/50">Daftar perangkat yang saat ini sedang login ke Dashboard Admin.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0c0805] text-white/70">
              <tr>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Device Info</th>
                <th className="px-6 py-3 font-medium">Login Sejak</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-white/50">Memuat data...</td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-white/50">Belum ada sesi aktif.</td></tr>
              ) : (
                sessions.map(s => {
                  const isCurrent = s.token_hash === currentSession;
                  return (
                    <tr key={s.id} className={isCurrent ? "bg-amber-500/10/30" : "hover:bg-[#0c0805] transition-colors"}>
                      <td className="px-6 py-4 font-medium text-white/90">{s.ip_address}</td>
                      <td className="px-6 py-4 text-white/70 max-w-[200px] sm:max-w-xs truncate" title={s.device_info}>{s.device_info}</td>
                      <td className="px-6 py-4 text-white/50">{new Date(s.created_at).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        {isCurrent ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Sesi Ini</span>
                        ) : (
                          <span className="px-2 py-1 bg-[#1a120e] text-white/70 text-xs font-bold rounded">Aktif</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {!isCurrent && (
                          <button 
                            onClick={() => handleRevoke(s.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                          >
                            Logout
                          </button>
                        )}                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ManageTheme() {
  const [activeTheme, setActiveTheme] = useState("cid-dark");
  const [loading, setLoading] = useState(true);

  // Lanjutan Settings Modal
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [socialIg, setSocialIg] = useState("");
  const [socialDiscord, setSocialDiscord] = useState("");
  const [waCta, setWaCta] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    async function loadTheme() {
      const res = await adminApi("fetchSettings");
      if (res && res.siteSettings) {
        const themeSetting = res.siteSettings.find((s: any) => s.key === "active_theme");
        if (themeSetting) {
          setActiveTheme(themeSetting.value);
        }
        
        const igSetting = res.siteSettings.find((s: any) => s.key === "social_instagram");
        if (igSetting) setSocialIg(igSetting.value);
        
        const discordSetting = res.siteSettings.find((s: any) => s.key === "social_discord");
        if (discordSetting) setSocialDiscord(discordSetting.value);
        
        const waSetting = res.siteSettings.find((s: any) => s.key === "wa_cta");
        if (waSetting) setWaCta(waSetting.value);
        
        const titleSetting = res.siteSettings.find((s: any) => s.key === "hero_title");
        if (titleSetting) setHeroTitle(titleSetting.value);
        
        const subtitleSetting = res.siteSettings.find((s: any) => s.key === "hero_subtitle");
        if (subtitleSetting) setHeroSubtitle(subtitleSetting.value);
        
        const descSetting = res.siteSettings.find((s: any) => s.key === "hero_desc");
        if (descSetting) setHeroDesc(descSetting.value);
      }
      setLoading(false);
    }
    loadTheme();
  }, []);

  const handleSaveTheme = async (themeId: string) => {
    setActiveTheme(themeId);
    Swal.fire({
      title: "Menyimpan Tema...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });
    
    const res = await adminApi("updateTheme", { theme: themeId });
    if (res.success) {
      Swal.fire("Berhasil", "Tema website berhasil diubah! Cek halaman depan.", "success");
    } else {
      Swal.fire("Gagal", res.error || "Gagal mengubah tema", "error");
    }
  };

  const handleSaveThemeSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await adminApi("saveThemeSettings", { 
        social_instagram: socialIg, 
        social_discord: socialDiscord, 
        wa_cta: waCta,
        hero_title: heroTitle,
        hero_subtitle: heroSubtitle,
        hero_desc: heroDesc
      });
      if (res.success) {
        Swal.fire({ icon: "success", title: "Berhasil", text: "Pengaturan lanjutan berhasil disimpan.", timer: 1500, showConfirmButton: false });
        setShowThemeSettings(false);
      } else {
        Swal.fire("Gagal", res.error || "Gagal menyimpan", "error");
      }
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const themes = [
    {
      id: "cid-classic",
      name: "Simple Theme",
      description: "Tema Original (HTML yang Anda rekomendasikan). Lengkap dengan Mobile Bottom Nav.",
      color1: "#08090a",
      color2: "#00ff66"
    },
    {
      id: "cid-dark",
      name: "Default Theme",
      description: "Tema bawaan dengan nuansa hitam dan emas. Sangat elegan dan profesional.",
      color1: "#0c0805",
      color2: "#F59E0B"
    }
  ];

  if (loading) return <p className="text-white/50">Memuat pengaturan tema...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-[#140e0b] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden">
        <div className="px-6 py-4 border-b border-amber-900/20">
          <h3 className="text-lg font-semibold text-white/90">Pilih Tema Website</h3>
          <p className="text-sm text-white/50">Pilih template visual untuk halaman depan (Front-end) website Anda.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.map(t => (
              <div 
                key={t.id} 
                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  activeTheme === t.id 
                    ? "border-amber-500 bg-amber-500/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transform -translate-y-1" 
                    : "border-amber-900/30 hover:border-blue-300 hover:shadow"
                }`}
                onClick={() => handleSaveTheme(t.id)}
              >
                {activeTheme === t.id && (
                  <div className="absolute top-3 right-3 bg-amber-500/100 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Aktif
                  </div>
                )}
                
                {/* Visual Preview Placeholder */}
                <div className="w-full h-32 rounded-lg mb-4 flex overflow-hidden shadow-inner border border-amber-900/30">
                  <div className="flex-1" style={{ backgroundColor: t.color1 }}></div>
                  <div className="w-12" style={{ backgroundColor: t.color2 }}></div>
                </div>
                
                <h4 className="font-bold text-white/90 text-lg mb-1">{t.name}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{t.description}</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <button 
                    onClick={() => handleSaveTheme(t.id)}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeTheme === t.id 
                        ? "bg-amber-500/100 text-white" 
                        : "bg-[#1a120e] text-white/70 hover:bg-gray-200"
                    }`}
                  >
                    {activeTheme === t.id ? "Tema Digunakan" : "Gunakan Tema Ini"}
                  </button>
                  
                  {activeTheme === t.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowThemeSettings(true); }}
                      className="p-2 rounded-lg bg-[#1a120e] text-white/70 hover:bg-gray-200 transition-colors"
                      title="Pengaturan Lanjutan Tema"
                    >
                      <Settings className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Pengaturan Lanjutan */}
      {showThemeSettings && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4" onClick={() => setShowThemeSettings(false)}>
          <div 
            className="bg-[#140e0b] rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20 bg-[#140e0b] rounded-t-2xl">
              <h3 className="text-lg font-bold text-white/90">Pengaturan Lanjutan Tema</h3>
              <button onClick={() => setShowThemeSettings(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#1a120e] text-gray-400 hover:text-white/70 transition-colors text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSaveThemeSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Link Instagram (Navbar)</label>
                <input 
                  value={socialIg} 
                  onChange={e => setSocialIg(e.target.value)} 
                  className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors" 
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">Link Discord (Navbar)</label>
                <input 
                  value={socialDiscord} 
                  onChange={e => setSocialDiscord(e.target.value)} 
                  className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors" 
                  placeholder="https://discord.gg/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-1.5">WhatsApp CTA (Floating Button)</label>
                <input 
                  value={waCta} 
                  onChange={e => setWaCta(e.target.value)} 
                  className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors" 
                  placeholder="628123456789"
                />
                <p className="text-xs text-white/50 mt-1">Gunakan format 628... (Hanya angka)</p>
              </div>

              <div className="border-t border-amber-900/20 pt-4 mt-4">
                <h4 className="font-bold text-white/90 mb-3 text-sm">Teks Utama Beranda</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Judul (Baris 1)</label>
                    <input 
                      value={heroTitle} 
                      onChange={e => setHeroTitle(e.target.value)} 
                      className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors" 
                      placeholder="Belanja Item GT"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Sub-Judul (Baris 2 Berwarna)</label>
                    <input 
                      value={heroSubtitle} 
                      onChange={e => setHeroSubtitle(e.target.value)} 
                      className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors" 
                      placeholder="Cepat, Aman, Otomatis"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Deskripsi Pendek</label>
                    <textarea 
                      value={heroDesc} 
                      onChange={e => setHeroDesc(e.target.value)} 
                      className="w-full border border-amber-900/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 p-2.5 rounded-lg text-sm text-white/90 outline-none transition-colors min-h-[60px]" 
                      placeholder="Proxy, akun, currency..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex items-center gap-3 border-t border-amber-900/20 mt-6">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="flex-1 bg-[#4272d7] hover:bg-amber-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {savingSettings ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── LIVE CHAT MANAGEMENT ───
interface ChatSession {
  id: string;
  customer_name: string;
  status: string;
  last_message_at: string;
  created_at: string;
  lastMsg?: string;
  unreadCount?: number;
}

interface ChatMsg {
  id: number;
  session_id: string;
  sender: string;
  message: string;
  image_url?: string;
  created_at: string;
}

const renderMessageText = (text: string) => {
  return text.split('\n').map((line, i, arr) => {
    const parts = line.split(/(\*[^*]+\*)/g);
    return (
      <span key={i}>
        {parts.map((part, j) => {
          if (part.startsWith('*') && part.endsWith('*')) {
            return <strong key={j} className="font-bold">{part.slice(1, -1)}</strong>;
          }
          return part;
        })}
        {i < arr.length - 1 && <br />}
      </span>
    );
  });
};

function ManageLiveChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [readSessions, setReadSessions] = useState<Record<string, string>>({});
  const notifAudioRef = useRef<HTMLAudioElement | null>(null);
  const [chatSettings, setChatSettings] = useState({ buy_rate_text: "", sell_rate_text: "", qris_image_url: "" });
  const [settingsTab, setSettingsTab] = useState<"chats" | "settings">("chats");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const qrisFileInputRef = useRef<HTMLInputElement>(null);

  // Load read status from localStorage + request notification permission
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kucaidl_read_sessions");
      if (stored) setReadSessions(JSON.parse(stored));
    } catch {}
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    notifAudioRef.current = new Audio("/notif.mp3");
    // Load chat settings
    fetch("/api/chat/settings")
      .then(r => r.json())
      .then(d => setChatSettings(d))
      .catch(() => {});
  }, []);

  const markAsRead = (sessionId: string, lastMessageAt: string) => {
    setReadSessions(prev => {
      const next = { ...prev, [sessionId]: lastMessageAt };
      localStorage.setItem("kucaidl_read_sessions", JSON.stringify(next));
      return next;
    });
  };

  // Fetch all sessions with latest message preview
  const fetchSessions = useCallback(async () => {
    const { data: sessionsData } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (sessionsData) {
      // Get last message for each session
      const withPreviews = await Promise.all(
        sessionsData.map(async (s: ChatSession) => {
          const { data: lastMsgs } = await supabase
            .from("chat_messages")
            .select("message, sender")
            .eq("session_id", s.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...s,
            lastMsg: lastMsgs?.[0]
              ? `${lastMsgs[0].sender === "admin" ? "Anda: " : ""}${lastMsgs[0].message}`
              : "Belum ada pesan",
          };
        })
      );
      setSessions(withPreviews);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();

    // Subscribe to new sessions & messages
    const ch = supabase
      .channel("admin-livechat")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_sessions" }, () => fetchSessions())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, (payload: any) => {
        const msg = payload.new as ChatMsg;
        // Browser notification for customer messages
        if (msg.sender !== "admin") {
          try { notifAudioRef.current?.play().catch(() => {}); } catch {}
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            new Notification("💬 Chat Baru Masuk!", {
              body: msg.message || "Pelanggan mengirim gambar",
              icon: "/icon.png",
              tag: "kucai-chat-" + msg.id,
            });
          }
        }
        // Update messages if viewing the right session
        setMessages((prev) => {
          if (prev.length > 0 && prev[0]?.session_id === msg.session_id) {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          }
          return prev;
        });
        // Refresh sessions for preview
        fetchSessions();
      })
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [fetchSessions]);

  // Fetch messages for selected session
  useEffect(() => {
    if (!activeSession) return;

    async function fetchMsgs() {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", activeSession)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    }
    fetchMsgs();
    setTimeout(() => replyInputRef.current?.focus(), 100);
  }, [activeSession]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reply.trim();
    if ((!trimmed && selectedFiles.length === 0) || !activeSession || sending || uploading) return;

    setSending(true);

    if (selectedFiles.length > 0) {
      setUploading(true);
      try {
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
          const result = await res.json();
          if (result.url) {
            await supabase.from("chat_messages").insert({
              session_id: activeSession,
              sender: "admin",
              message: i === 0 ? trimmed : "",
              image_url: result.url,
            });
          }
        }
        await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", activeSession);
        setReply("");
        setSelectedFiles([]);
      } catch {}
      setUploading(false);
    } else {
      await supabase.from("chat_messages").insert({
        session_id: activeSession,
        sender: "admin",
        message: trimmed,
      });

      await supabase
        .from("chat_sessions")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeSession);

      setReply("");
    }

    setSending(false);
    replyInputRef.current?.focus();
  };

  const activeSessionData = sessions.find((s) => s.id === activeSession);

  if (loading) return <p className="text-white/50">Memuat data chat...</p>;

  return (
    <div className="space-y-4">
      {/* Tab switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setSettingsTab("chats")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${settingsTab === "chats" ? "bg-amber-600 text-white" : "bg-amber-900/20 text-amber-400 hover:bg-amber-900/40"}`}
        >💬 Percakapan</button>
        <button
          onClick={() => setSettingsTab("settings")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${settingsTab === "settings" ? "bg-amber-600 text-white" : "bg-amber-900/20 text-amber-400 hover:bg-amber-900/40"}`}
        >⚙️ Quick Reply Settings</button>
      </div>

      {settingsTab === "settings" ? (
        <div className="bg-[#140e0b] border border-amber-900/20 rounded-xl p-6 space-y-5">
          <h3 className="font-bold text-white/90">Quick Reply Settings</h3>

          <div>
            <label className="block text-xs text-amber-400 font-bold mb-1">Teks Auto-Reply tombol BELI 🛒</label>
            <textarea
              value={chatSettings.buy_rate_text}
              onChange={e => setChatSettings(p => ({ ...p, buy_rate_text: e.target.value }))}
              rows={10}
              className="w-full bg-black/30 border border-amber-900/30 rounded-lg p-3 text-white/80 text-sm font-mono resize-y focus:outline-none focus:border-amber-500"
              placeholder="Teks rate beli yang akan dikirim otomatis..."
            />
          </div>

          <div>
            <label className="block text-xs text-amber-400 font-bold mb-1">Teks Auto-Reply tombol JUAL 💰</label>
            <textarea
              value={chatSettings.sell_rate_text}
              onChange={e => setChatSettings(p => ({ ...p, sell_rate_text: e.target.value }))}
              rows={6}
              className="w-full bg-black/30 border border-amber-900/30 rounded-lg p-3 text-white/80 text-sm font-mono resize-y focus:outline-none focus:border-amber-500"
              placeholder="Instruksi untuk customer yang mau jual..."
            />
          </div>

          <div>
            <label className="block text-xs text-amber-400 font-bold mb-1">Gambar QRIS (dikirim otomatis saat klik BELI)</label>
            <input type="file" ref={qrisFileInputRef} accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const fd = new FormData();
              fd.append("file", file);
              fd.append("folder", "qris");
              const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
              const result = await res.json();
              if (result.url) setChatSettings(p => ({ ...p, qris_image_url: result.url }));
            }} />
            {chatSettings.qris_image_url && (
              <img src={chatSettings.qris_image_url} alt="QRIS" className="w-40 h-40 object-contain rounded-lg border border-amber-900/30 mb-2" />
            )}
            <button
              onClick={() => qrisFileInputRef.current?.click()}
              className="px-4 py-2 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/50 text-amber-400 text-sm rounded-lg transition-colors"
            >📷 Upload Gambar QRIS</button>
            {chatSettings.qris_image_url && (
              <span className="ml-3 text-xs text-green-400">✓ Gambar terpasang</span>
            )}
          </div>

          <button
            disabled={savingSettings}
            onClick={async () => {
              setSavingSettings(true);
              const res = await fetch("/api/admin/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "saveChatSettings", data: chatSettings }),
              });
              setSavingSettings(false);
              if (res.ok) { setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); }
            }}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors"
          >{savingSettings ? "Menyimpan..." : settingsSaved ? "✓ Tersimpan!" : "Simpan Pengaturan"}</button>
        </div>
      ) : (
      <div className="bg-[#140e0b] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] border border-amber-900/20 overflow-hidden" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
      <div className="flex h-full">
        {/* Left Panel — Session List */}
        <div className={`${activeSession ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] shrink-0 border-r border-amber-900/20 flex-col`}>
          <div className="px-4 py-3 border-b border-amber-900/20 bg-[#0c0805]">
            <h3 className="font-bold text-white/90 text-sm">Percakapan</h3>
            <p className="text-xs text-white/50">{sessions.length} sesi chat</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                Belum ada percakapan masuk.
              </div>
            ) : (
              sessions.map((s) => {
                const isUnread = s.lastMsg && !s.lastMsg.startsWith("Anda:") && (!readSessions[s.id] || new Date(s.last_message_at).getTime() > new Date(readSessions[s.id]).getTime());
                
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveSession(s.id);
                      markAsRead(s.id, s.last_message_at);
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-amber-500/10 transition-colors flex gap-3 ${
                      activeSession === s.id ? "bg-amber-500/10 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-500 font-bold text-sm mt-0.5">
                      {s.customer_name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold text-sm truncate ${isUnread ? 'text-amber-400 font-bold' : 'text-white/90'}`}>
                          {s.customer_name}
                        </span>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          )}
                          <span className={`text-[10px] ${isUnread ? 'text-amber-400 font-bold' : 'text-gray-400'}`}>
                            {new Date(s.last_message_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <p className={`text-xs truncate ${s.status === 'blocked' ? 'text-red-400' : (isUnread ? 'text-white/80 font-medium' : 'text-white/50')}`}>
                        {s.status === 'blocked' ? '🚫 Diblokir' : s.lastMsg}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel — Chat */}
        <div className={`${!activeSession ? 'hidden md:flex' : 'flex'} flex-1 flex-col w-full`}>
          {!activeSession ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <Headphones className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-sm font-medium">Pilih percakapan untuk memulai</p>
              <p className="text-xs mt-1">Klik sesi di panel sebelah kiri</p>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3 border-b border-amber-900/20 bg-[#0c0805] flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveSession(null)}
                  className="md:hidden flex items-center justify-center w-8 h-8 mr-1 bg-amber-900/20 text-amber-500 rounded-full hover:bg-amber-900/40"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 rounded-full bg-amber-900/40 flex items-center justify-center text-amber-500 font-bold text-sm">
                  {activeSessionData?.customer_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white/90 text-sm">
                    {activeSessionData?.customer_name || "Customer"}
                    {activeSessionData?.status === 'blocked' && (
                      <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">DIBLOKIR</span>
                    )}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Mulai: {activeSessionData ? new Date(activeSessionData.created_at).toLocaleString("id-ID") : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  {activeSessionData?.status !== 'blocked' ? (
                    <button
                      onClick={async () => {
                        if (!confirm(`Blokir ${activeSessionData?.customer_name}? Customer tidak bisa mengirim pesan lagi.`)) return;
                        await supabase.from('chat_sessions').update({ status: 'blocked' }).eq('id', activeSession);
                        fetchSessions();
                      }}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold rounded-lg transition-colors border border-red-200"
                    >
                      🚫 Blokir
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        await supabase.from('chat_sessions').update({ status: 'active' }).eq('id', activeSession);
                        fetchSessions();
                      }}
                      className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 text-xs font-semibold rounded-lg transition-colors border border-green-200"
                    >
                      ✅ Buka Blokir
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (!confirm(`Hapus seluruh percakapan dengan ${activeSessionData?.customer_name}?`)) return;
                      const res = await adminApi("deleteChatSession", { id: activeSession });
                      if (res.error) {
                        alert("Gagal menghapus percakapan: " + res.error);
                        return;
                      }
                      setActiveSession(null);
                      setMessages([]);
                      fetchSessions();
                    }}
                    className="px-3 py-1.5 bg-[#0c0805] hover:bg-[#1a120e] text-white/50 text-xs font-semibold rounded-lg transition-colors border border-amber-900/30"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#0c0805]/50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-[0_4px_20px_rgba(0,0,0,0.3)] ${
                        msg.sender === "admin"
                          ? "bg-amber-600 text-white rounded-br-md"
                          : "bg-[#140e0b] text-white/90 border border-amber-900/30 rounded-bl-md"
                      }`}
                    >
                      {(msg as any).image_url && (
                        <img src={(msg as any).image_url} alt="" className="rounded-lg max-w-full max-h-[200px] object-cover mb-1 cursor-pointer" onClick={() => setPreviewImage((msg as any).image_url)} />
                      )}
                      {msg.message && <span>{renderMessageText(msg.message)}</span>}
                      <div
                        className={`text-[10px] mt-1 ${
                          msg.sender === "admin" ? "text-amber-200" : "text-gray-400"
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              <div className="shrink-0 flex flex-col border-t border-amber-900/20 bg-[#140e0b]">
                {selectedFiles.length > 0 && (
                  <div className="flex gap-2 p-3 border-b border-amber-900/20 overflow-x-auto">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-amber-900/30">
                        <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-red-500 transition-colors">
                           <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <form
                  onSubmit={handleSendReply}
                  className="px-4 py-3 flex items-center gap-3"
                >
                  <input type="file" ref={adminFileInputRef} accept="image/*" multiple className="hidden" onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      const newFiles = Array.from(files);
                      setSelectedFiles(prev => [...prev, ...newFiles]);
                    }
                    if (adminFileInputRef.current) adminFileInputRef.current.value = "";
                  }} />
                  <button type="button" onClick={() => adminFileInputRef.current?.click()} disabled={uploading} className="w-10 h-10 shrink-0 bg-[#1a120e] hover:bg-gray-200 disabled:opacity-50 rounded-xl flex items-center justify-center text-white/50 hover:text-amber-500 transition-colors border border-amber-900/30">
                    <ImagePlus className="w-4 h-4" />
                  </button>
                  <input
                    ref={replyInputRef}
                    type="text"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder={uploading ? "Mengunggah gambar..." : (selectedFiles.length > 0 ? "Tambahkan keterangan..." : "Ketik balasan...")}
                    className="flex-1 bg-[#1a120e] border border-amber-900/30 rounded-xl px-4 py-2.5 text-sm text-white/90 placeholder-gray-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                    maxLength={500}
                    disabled={uploading}
                  />
                  <button
                    type="submit"
                    disabled={(!reply.trim() && selectedFiles.length === 0) || sending || uploading}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors text-sm flex items-center gap-2"
                  >
                    Kirim
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 text-white hover:text-amber-500 bg-black/50 w-10 h-10 flex items-center justify-center rounded-full transition-colors z-10 text-xl font-bold"
            >
              ✕
            </button>
            <img src={previewImage} alt="Preview" className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </div>
        </div>
      )}
    </div>
      )}
    </div>
  );
}
