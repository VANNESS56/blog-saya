"use client";

import { useState, useEffect } from "react";
import { type Account, type Testimonial, type Reputation } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, MessageSquare, Star, LogOut, Menu, Search, Bell, Settings, ShoppingCart, Database, Package, User, Palette } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "testimonials" | "reputations" | "settings" | "orders" | "stock" | "products" | "profile" | "theme">("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#e5e5e5] text-gray-800 font-sans">
      {/* HEADER DESKTOP */}
      <header className="fixed top-0 left-0 right-0 h-[75px] bg-white shadow-sm z-40 flex items-center justify-between px-4 lg:px-8 transition-all duration-300 ml-0 lg:ml-72">
        <div className="flex items-center gap-4">
          <button suppressHydrationWarning className="lg:hidden p-2 text-gray-600" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64 border border-gray-200">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input suppressHydrationWarning type="text" placeholder="Search for data & reports..." className="bg-transparent border-none outline-none text-sm w-full text-gray-700" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button suppressHydrationWarning className="relative text-gray-500 hover:text-blue-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 border-l pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Superadmin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
              A
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-screen w-72 bg-white border-r border-gray-200 z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="h-[75px] shrink-0 flex items-center justify-center border-b border-gray-100 px-8">
          <h1 className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
            Kucai<span className="text-gray-800 font-normal">DL</span>
          </h1>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </button>
            </li>

            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("testimonials")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'testimonials' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <Star className="w-5 h-5" /> Testimonials
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("reputations")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'reputations' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <MessageSquare className="w-5 h-5" /> Reputations
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <Settings className="w-5 h-5" /> Settings (Prices)
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <ShoppingCart className="w-5 h-5" /> Orders
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("stock")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'stock' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <Database className="w-5 h-5" /> Digital Stock
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'products' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <Package className="w-5 h-5" /> Digital Products
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <User className="w-5 h-5" /> Pengaturan Profile
              </button>
            </li>
            <li>
              <button suppressHydrationWarning 
                onClick={() => setActiveTab("theme")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'theme' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'}`}
              >
                <Palette className="w-5 h-5" /> Website Theme
              </button>
            </li>
          </ul>
          <hr className="my-6 border-gray-100" />
          <button suppressHydrationWarning 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
        <div className="p-5 border-t border-gray-100 text-center shrink-0">
          <p className="text-[12px] text-gray-400 font-medium tracking-wide">
            &copy; {new Date().getFullYear()} KUCAIDL.<br/>
            Created with <span className="text-red-500">❤️</span> By <strong className="text-gray-500">VannessWangsaff</strong>
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
            <h2 className="text-3xl font-bold text-gray-800 capitalize mb-1">Manage {activeTab}</h2>
            <p className="text-sm text-gray-500">Overview & statistics</p>
          </div>

          <div className="space-y-6">
            {activeTab === "dashboard" && <DashboardOverview />}

            {activeTab === "testimonials" && <ManageTestimonials />}
            {activeTab === "reputations" && <ManageReputations />}
            {activeTab === "settings" && <ManageSettings />}
            {activeTab === "orders" && <ManageOrders />}
            {activeTab === "stock" && <ManageStock />}
            {activeTab === "products" && <ManageProducts />}
            {activeTab === "profile" && <ManageProfile />}
            {activeTab === "theme" && <ManageTheme />}
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
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="bg-blue-50 text-blue-600 p-4 rounded-lg"><LayoutDashboard className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Pengunjung Web</p>
          <h4 className="text-2xl font-bold text-gray-800">{stats.visitors.toLocaleString('id-ID')}</h4>
        </div>
      </div>
      

      
      {/* Jumlah Testimoni */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="bg-amber-50 text-amber-600 p-4 rounded-lg"><Star className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Jumlah Testimoni</p>
          <h4 className="text-2xl font-bold text-gray-800">{stats.testimonials}</h4>
        </div>
      </div>
      
      {/* Rate BGL */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="bg-purple-50 text-purple-600 p-4 rounded-lg"><MessageSquare className="w-8 h-8" /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Rate BGL / DL</p>
          <h4 className="text-[17px] font-bold text-gray-800">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add New Account</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
            <input suppressHydrationWarning value={title} onChange={e=>setTitle(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price (IDR)</label>
            <input suppressHydrationWarning type="number" value={price} onChange={e=>setPrice(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Image (Upload File)</label>
            <input suppressHydrationWarning type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} className="w-full border border-gray-300 p-[7px] rounded text-sm text-gray-800 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <input suppressHydrationWarning value={description} onChange={e=>setDescription(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="md:col-span-2">
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-sm hover:bg-blue-600 transition-colors font-medium text-sm">Submit Form</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Accounts Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
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
                  <tr key={acc.id} className="border-b border-gray-50 hover:bg-gray-50/50">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Testimonial</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Screenshot (Upload File)</label>
            <input suppressHydrationWarning type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} required className="w-full border border-gray-300 p-[7px] rounded text-sm text-gray-800 bg-white" />
          </div>
          <div>
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-sm hover:bg-blue-600 transition-colors font-medium text-sm">Submit Testimonial</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Testimonials Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
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
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      {t.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <a href={t.image_url} target="_blank" rel="noreferrer">
                          <img src={t.image_url} alt="" className="w-12 h-12 object-cover rounded shadow-sm border border-gray-200" />
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Reputations Data Table</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs text-gray-700 uppercase">
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
                <tr key={rep.id} className="border-b border-gray-50 hover:bg-gray-50/50">
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Manage Settings</h3>
      </div>
      <form onSubmit={handleSave} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Buy Price (BGL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
            <input suppressHydrationWarning type="number" value={buyBgl} onChange={e=>setBuyBgl(e.target.value)} required className="w-full border border-gray-300 pl-10 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Harga Beli User (Harga Jual Anda)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Buy Price (DL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
            <input suppressHydrationWarning type="number" value={buyDl} onChange={e=>setBuyDl(e.target.value)} required className="w-full border border-gray-300 pl-10 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Harga Beli DL User (Harga Jual Anda)</p>
        </div>
        <div className="md:col-span-2 border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">Sell Price (BGL)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
            <input suppressHydrationWarning type="number" value={sellBgl} onChange={e=>setSellBgl(e.target.value)} required className="w-full border border-gray-300 pl-10 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Harga Jual User (Harga Beli Anda). DL Sell Price otomatis: Rp {sellBgl ? Math.floor(Number(sellBgl)/100).toLocaleString('id-ID') : 0}</p>
        </div>

        <div className="md:col-span-2 border-t border-gray-100 pt-4">
          <h4 className="font-semibold text-gray-700 mb-4">Pengaturan WhatsApp</h4>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp KUCAIDL</label>
          <input suppressHydrationWarning type="text" value={waKucaidl} onChange={e=>setWaKucaidl(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="628..." />
          <p className="text-xs text-gray-500 mt-1">Nomor untuk transaksi DL/BGL (Format: 628...)</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp KucaiAkun</label>
          <input suppressHydrationWarning type="text" value={waKucaiakun} onChange={e=>setWaKucaiakun(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="628..." />
          <p className="text-xs text-gray-500 mt-1">Nomor untuk transaksi Jual/Beli Akun (Format: 628...)</p>
        </div>

        <div className="md:col-span-2 mt-2">
          <button suppressHydrationWarning type="submit" disabled={saving} className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-sm hover:bg-blue-600 transition-colors font-medium text-sm disabled:opacity-50">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ManageOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const res = await fetch("/api/admin/ecommerce", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "fetchOrders" })
      });
      const data = await res.json();
      if (data.data) setOrders(data.data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Semua Pesanan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-3 font-medium">Invoice</th>
              <th className="px-6 py-3 font-medium">Customer WA</th>
              <th className="px-6 py-3 font-medium">Produk</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-xs text-blue-600">{order.invoice_no}</td>
                <td className="px-6 py-4">{order.customer_wa}</td>
                <td className="px-6 py-4">{order.digital_products?.title || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    {order.payment_status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">Rp {order.amount.toLocaleString("id-ID")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Tambah Stok Akun Digital</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pilih Produk</label>
            <select value={productId} onChange={e=>setProductId(e.target.value)} className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800">
              {products.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Data Akun (Email / Pass dll)</label>
            <input suppressHydrationWarning value={credentials} onChange={e=>setCredentials(e.target.value)} required className="w-full border border-gray-300 p-2.5 rounded text-sm text-gray-800" placeholder="Email: xxx | Pass: yyy" />
          </div>
          <div className="md:col-span-2">
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded shadow-sm hover:bg-blue-600 transition-colors font-medium text-sm">Tambah Stok</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Produk</th>
                <th className="px-6 py-3 font-medium">Data Akun</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan={4} className="p-4 text-center">Loading...</td></tr> : stock.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
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

  const inputClass = "w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 p-2.5 rounded-lg text-sm text-gray-800 outline-none transition-colors";

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add New Digital Product</h3>
        </div>
        <form onSubmit={handleAdd} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <select value={category} onChange={e=>setCategory(e.target.value)} className={inputClass}>
              <option value="AKUN">AKUN</option>
              <option value="LAYANAN">LAYANAN</option>
              <option value="ITEM">ITEM / DLL</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Title (Product Name)</label>
            <input suppressHydrationWarning value={title} onChange={e=>setTitle(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price (IDR)</label>
            <input suppressHydrationWarning type="number" value={price} onChange={e=>setPrice(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Product Image (Upload)</label>
            <input suppressHydrationWarning type="file" accept="image/*" onChange={e=>setImageFile(e.target.files?.[0] || null)} className={inputClass + " p-[7px] bg-white"} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
            <textarea suppressHydrationWarning rows={3} value={description} onChange={e=>setDescription(e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <button suppressHydrationWarning type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-600 transition-colors font-medium text-sm">Create Product</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
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
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">{p.category}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{p.title}</td>
                  <td className="px-6 py-4 text-emerald-600 font-mono font-bold">Rp {p.price.toLocaleString("id-ID")}</td>
                  <td className="px-6 py-4">
                    {p.icon && p.icon.startsWith("http") ? (
                      <img src={p.icon} alt={p.title} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <span className="text-gray-500 text-xs">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button suppressHydrationWarning onClick={() => openEdit(p)} className="text-blue-500 hover:text-blue-700 text-xs font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors">Edit</button>
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-gray-800">Edit Produk</h3>
              <button onClick={() => setEditProduct(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xl">&times;</button>
            </div>
            
            <div className="p-6 space-y-4">
              {editIcon && editIcon.startsWith("http") && (
                <div className="flex justify-center">
                  <img src={editIcon} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-gray-200" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className={inputClass}>
                  <option value="AKUN">AKUN</option>
                  <option value="LAYANAN">LAYANAN</option>
                  <option value="ITEM">ITEM / DLL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Produk</label>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga (IDR)</label>
                <input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
                <textarea rows={3} value={editDesc} onChange={e => setEditDesc(e.target.value)} className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ganti Gambar (Upload)</label>
                <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files?.[0] || null)} className={inputClass + " p-[7px] bg-white"} />
                <p className="text-xs text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti gambar.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl sticky bottom-0">
              <button
                onClick={handleEditSave}
                disabled={saving}
                className="flex-1 bg-[#4272d7] hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <button
                onClick={() => setEditProduct(null)}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors text-sm"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Ubah Kredensial Login</h3>
          <p className="text-sm text-gray-500">Ubah username dan password untuk keamanan akun Anda.</p>
        </div>
        <form onSubmit={handleUpdateCredentials} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username Baru</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required
              className="w-full md:w-1/2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 p-2.5 rounded-lg text-sm outline-none transition-colors" 
              placeholder="Masukkan username baru..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full md:w-1/2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 p-2.5 rounded-lg text-sm outline-none transition-colors" 
              placeholder="Masukkan password baru..."
            />
          </div>
          <button type="submit" className="bg-[#4272d7] text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-600 transition-colors text-sm font-medium">
            Simpan Perubahan
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Perangkat Aktif (Sesi)</h3>
          <p className="text-sm text-gray-500">Daftar perangkat yang saat ini sedang login ke Dashboard Admin.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
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
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Memuat data...</td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-gray-500">Belum ada sesi aktif.</td></tr>
              ) : (
                sessions.map(s => {
                  const isCurrent = s.token_hash === currentSession;
                  return (
                    <tr key={s.id} className={isCurrent ? "bg-blue-50/30" : "hover:bg-gray-50 transition-colors"}>
                      <td className="px-6 py-4 font-medium text-gray-800">{s.ip_address}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-[200px] sm:max-w-xs truncate" title={s.device_info}>{s.device_info}</td>
                      <td className="px-6 py-4 text-gray-500">{new Date(s.created_at).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4">
                        {isCurrent ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Sesi Ini</span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded">Aktif</span>
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
        wa_cta: waCta 
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
      name: "CidGrowtopia Classic",
      description: "Tema Original (HTML yang Anda rekomendasikan). Lengkap dengan Mobile Bottom Nav.",
      color1: "#08090a",
      color2: "#00ff66"
    },
    {
      id: "cid-dark",
      name: "CidDark Premium",
      description: "Tema bawaan dengan nuansa hitam dan emas. Sangat elegan dan profesional.",
      color1: "#0c0805",
      color2: "#F59E0B"
    },
    {
      id: "minimalist",
      name: "Minimalist Clean",
      description: "Tema putih bersih, cocok untuk kesan startup, profesional dan rapi.",
      color1: "#ffffff",
      color2: "#2563eb"
    },
    {
      id: "gaming",
      name: "Cyberpunk Gaming",
      description: "Nuansa gelap dengan aksen ungu neon. Cocok untuk toko item game.",
      color1: "#09090b",
      color2: "#8b5cf6"
    }
  ];

  if (loading) return <p className="text-gray-500">Memuat pengaturan tema...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Pilih Tema Website</h3>
          <p className="text-sm text-gray-500">Pilih template visual untuk halaman depan (Front-end) website Anda.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {themes.map(t => (
              <div 
                key={t.id} 
                className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                  activeTheme === t.id 
                    ? "border-blue-500 bg-blue-50 shadow-md transform -translate-y-1" 
                    : "border-gray-200 hover:border-blue-300 hover:shadow"
                }`}
                onClick={() => handleSaveTheme(t.id)}
              >
                {activeTheme === t.id && (
                  <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Aktif
                  </div>
                )}
                
                {/* Visual Preview Placeholder */}
                <div className="w-full h-32 rounded-lg mb-4 flex overflow-hidden shadow-inner border border-gray-200">
                  <div className="flex-1" style={{ backgroundColor: t.color1 }}></div>
                  <div className="w-12" style={{ backgroundColor: t.color2 }}></div>
                </div>
                
                <h4 className="font-bold text-gray-800 text-lg mb-1">{t.name}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{t.description}</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <button 
                    onClick={() => handleSaveTheme(t.id)}
                    className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                      activeTheme === t.id 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {activeTheme === t.id ? "Tema Digunakan" : "Gunakan Tema Ini"}
                  </button>
                  
                  {activeTheme === t.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowThemeSettings(true); }}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white rounded-t-2xl">
              <h3 className="text-lg font-bold text-gray-800">Pengaturan Lanjutan Tema</h3>
              <button onClick={() => setShowThemeSettings(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSaveThemeSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Instagram (Navbar)</label>
                <input 
                  value={socialIg} 
                  onChange={e => setSocialIg(e.target.value)} 
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 p-2.5 rounded-lg text-sm text-gray-800 outline-none transition-colors" 
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Link Discord (Navbar)</label>
                <input 
                  value={socialDiscord} 
                  onChange={e => setSocialDiscord(e.target.value)} 
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 p-2.5 rounded-lg text-sm text-gray-800 outline-none transition-colors" 
                  placeholder="https://discord.gg/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp CTA (Floating Button)</label>
                <input 
                  value={waCta} 
                  onChange={e => setWaCta(e.target.value)} 
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 p-2.5 rounded-lg text-sm text-gray-800 outline-none transition-colors" 
                  placeholder="628123456789"
                />
                <p className="text-xs text-gray-500 mt-1">Gunakan format 628... (Hanya angka)</p>
              </div>
              
              <div className="pt-4 flex items-center gap-3 border-t border-gray-100 mt-6">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="flex-1 bg-[#4272d7] hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
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
