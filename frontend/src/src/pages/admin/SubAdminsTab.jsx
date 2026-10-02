import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  UserPlus, 
  Lock, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Package,
  Building2,
  Store,
  MessageSquare,
  Sliders,
  Sparkles
} from 'lucide-react';
import { 
  getSubAdmins, 
  saveSubAdmin, 
  updateSubAdmin, 
  deleteSubAdmin 
} from '../../utils/storage';
import { 
  apiGetSubAdmins, 
  apiCreateSubAdmin, 
  apiUpdateSubAdmin, 
  apiDeleteSubAdmin 
} from '../../services/api';

const DEFAULT_PERMISSIONS = {
  manage_products: true,
  delete_products: false,
  manage_brands: true,
  delete_brands: false,
  manage_retailers: false,
  manage_queries: true,
  manage_cms: false,
  manage_subadmins: false
};

export default function SubAdminsTab({ onNotification }) {
  const [subAdmins, setSubAdmins] = useState(() => getSubAdmins());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSubAdmin, setEditingSubAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'Catalog & Inventory Manager',
    status: 'active',
    permissions: { ...DEFAULT_PERMISSIONS }
  });

  const loadSubAdmins = async () => {
    setLoading(true);
    try {
      const data = await apiGetSubAdmins();
      if (Array.isArray(data) && data.length > 0) {
        setSubAdmins(data);
      } else {
        setSubAdmins(getSubAdmins());
      }
    } catch (e) {
      setSubAdmins(getSubAdmins());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubAdmins();
    const handleUpdate = () => loadSubAdmins();
    window.addEventListener('jmr_subadmins_updated', handleUpdate);
    return () => window.removeEventListener('jmr_subadmins_updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    setEditingSubAdmin(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'Catalog & Inventory Specialist',
      status: 'active',
      permissions: { ...DEFAULT_PERMISSIONS }
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubAdmin(sub);
    setFormData({
      name: sub.name || '',
      email: sub.email || '',
      phone: sub.phone || '',
      password: sub.password || '',
      role: sub.role || 'Staff Member',
      status: sub.status || 'active',
      permissions: {
        ...DEFAULT_PERMISSIONS,
        ...(sub.permissions || {})
      }
    });
    setShowPassword(false);
    setShowModal(true);
  };

  const handlePermissionToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [key]: !prev.permissions[key]
      }
    }));
  };

  const handleStatusToggle = async (sub) => {
    const newStatus = sub.status === 'active' ? 'inactive' : 'active';
    await apiUpdateSubAdmin(sub.id, { status: newStatus });
    loadSubAdmins();
    if (onNotification) {
      onNotification({
        message: `Staff Account ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
        subtext: `${sub.name} is now ${newStatus}.`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill Name and Email.');
      return;
    }

    if (!editingSubAdmin && !formData.password.trim()) {
      alert('Please provide a login password for this sub-admin.');
      return;
    }

    try {
      if (editingSubAdmin) {
        await apiUpdateSubAdmin(editingSubAdmin.id, formData);
        if (onNotification) {
          onNotification({
            message: 'Sub-Admin Permissions Updated',
            subtext: `Updated authorization limits for ${formData.name}.`
          });
        }
      } else {
        await apiCreateSubAdmin(formData);
        if (onNotification) {
          onNotification({
            message: 'New Sub-Admin Created',
            subtext: `${formData.name} can now log in under Admin Login tab.`
          });
        }
      }
      setShowModal(false);
      loadSubAdmins();
    } catch (err) {
      console.error(err);
      alert('Error saving sub-admin');
    }
  };

  const handleDelete = async (id) => {
    await apiDeleteSubAdmin(id);
    setDeleteConfirmId(null);
    loadSubAdmins();
    if (onNotification) {
      onNotification({
        message: 'Sub-Admin Removed',
        subtext: 'Staff access has been revoked.'
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="bg-[#131b2e] border border-blue-900/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Master Admin Control & Staff Delegations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Sub-Admin Authorization & Limitations
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Create staff accounts and set strict authorization boundaries. Define whether a sub-admin can edit products, delete records, view retailer applications, or update website banners.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Sub-Admin</span>
        </button>
      </div>

      {/* Sub-Admins List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subAdmins.map((sub) => {
          const perms = sub.permissions || {};
          const isActive = sub.status !== 'inactive';

          return (
            <div 
              key={sub.id}
              className={`rounded-2xl border p-5 transition-all duration-300 bg-[#131b2e] shadow-xl flex flex-col justify-between ${
                isActive ? 'border-blue-900/40 hover:border-purple-500/50' : 'border-red-900/40 opacity-75'
              }`}
            >
              <div>
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                      {sub.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm sm:text-base leading-tight flex items-center gap-1.5">
                        <span>{sub.name}</span>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                        )}
                      </h4>
                      <span className="text-[11px] text-purple-300 font-medium">{sub.role || 'Staff Member'}</span>
                    </div>
                  </div>

                  {/* Status Toggle Switch */}
                  <button
                    onClick={() => handleStatusToggle(sub)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                    title="Click to toggle active status"
                  >
                    {isActive ? 'Active' : 'Deactivated'}
                  </button>
                </div>

                {/* Account Credentials Summary */}
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5 text-xs text-slate-300 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">Login Email:</span>
                    <span className="font-mono text-white font-semibold">{sub.email}</span>
                  </div>
                  {sub.phone && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">Phone:</span>
                      <span className="text-slate-200">{sub.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400 text-[11px]">Login Type:</span>
                    <span className="text-amber-400 font-bold text-[10px] uppercase">Admin Login Tab</span>
                  </div>
                </div>

                {/* Granular Limitations & Permissions Matrix */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Authorization & Limitations:
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    
                    {/* Products */}
                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
                      perms.manage_products 
                        ? 'bg-blue-950/40 border-blue-800/40 text-blue-200' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500 line-through'
                    }`}>
                      <Package className="w-3 h-3 text-blue-400" />
                      <span>Edit Footwear</span>
                    </div>

                    {/* Delete Products */}
                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
                      perms.delete_products 
                        ? 'bg-red-950/40 border-red-800/40 text-red-200' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}>
                      <Trash2 className="w-3 h-3 text-red-400" />
                      <span>{perms.delete_products ? 'Can Delete' : 'No Delete'}</span>
                    </div>

                    {/* Brands */}
                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
                      perms.manage_brands 
                        ? 'bg-amber-950/40 border-amber-800/40 text-amber-200' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500 line-through'
                    }`}>
                      <Building2 className="w-3 h-3 text-amber-400" />
                      <span>Edit Brands</span>
                    </div>

                    {/* Retailers */}
                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
                      perms.manage_retailers 
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-200' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}>
                      <Store className="w-3 h-3 text-emerald-400" />
                      <span>{perms.manage_retailers ? 'Retailer Access' : 'No Retailers'}</span>
                    </div>

                    {/* Inquiries */}
                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
                      perms.manage_queries 
                        ? 'bg-sky-950/40 border-sky-800/40 text-sky-200' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}>
                      <MessageSquare className="w-3 h-3 text-sky-400" />
                      <span>Inquiries Desk</span>
                    </div>

                    {/* Website CMS */}
                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg border ${
                      perms.manage_cms 
                        ? 'bg-purple-950/40 border-purple-800/40 text-purple-200' 
                        : 'bg-slate-900/50 border-slate-800 text-slate-500'
                    }`}>
                      <Sliders className="w-3 h-3 text-purple-400" />
                      <span>{perms.manage_cms ? 'Can Edit CMS' : 'No CMS'}</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenEdit(sub)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Limitations</span>
                </button>

                {deleteConfirmId === sub.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="px-2.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors cursor-pointer"
                      title="Confirm Delete"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-2 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(sub.id)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/50 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                    title="Delete Sub-Admin"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT SUB-ADMIN MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0f172a] border border-blue-900/60 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingSubAdmin ? 'Edit Sub-Admin Limitations' : 'Add New Sub-Admin Staff'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure account credentials and exact authorization switches.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Staff Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Gupta"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Designation / Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g. Footwear Catalog Specialist"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Login Email (ID) *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff.email@jmrshooz.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Login Password {editingSubAdmin && '(leave blank to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={editingSubAdmin ? '••••••••' : 'Enter login password'}
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* AUTHORIZATION MATRIX / LIMITATIONS SWITCHES */}
              <div className="pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Granular Authorization & Limitations</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Toggle enabled features</span>
                </div>

                <div className="space-y-2.5">
                  
                  {/* Products Management */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Manage Footwear Products (SKUs)</div>
                        <div className="text-[10px] text-slate-400">Can add, edit prices, update images and model specifications.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.manage_products}
                      onChange={() => handlePermissionToggle('manage_products')}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                  {/* Delete Products */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Can Delete Products</div>
                        <div className="text-[10px] text-slate-400">Allow permanently deleting footwear models from catalog.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.delete_products}
                      onChange={() => handlePermissionToggle('delete_products')}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                  {/* Brands Management */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Manage Brands Portfolio</div>
                        <div className="text-[10px] text-slate-400">Can add new footwear brands, edit margins, and partner specifications.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.manage_brands}
                      onChange={() => handlePermissionToggle('manage_brands')}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                  {/* Delete Brands */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Can Delete Brands</div>
                        <div className="text-[10px] text-slate-400">Allow deleting authorized brand agreements from site.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.delete_brands}
                      onChange={() => handlePermissionToggle('delete_brands')}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                  {/* Retailers Approvals */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Retailer Directory & Approvals</div>
                        <div className="text-[10px] text-slate-400">Can approve pending retailers and inspect store tax GSTIN details.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.manage_retailers}
                      onChange={() => handlePermissionToggle('manage_retailers')}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                  {/* Inquiries Desk */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-sky-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Inquiries & Retailer Queries Desk</div>
                        <div className="text-[10px] text-slate-400">Can reply to stock inquiries, order bookings, and feedback.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.manage_queries}
                      onChange={() => handlePermissionToggle('manage_queries')}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                  {/* CMS & Banners */}
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Website CMS, Banners & Bank Details</div>
                        <div className="text-[10px] text-slate-400">Can edit hero banners, deal ticker, company bank details & owner story.</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.permissions.manage_cms}
                      onChange={() => handlePermissionToggle('manage_cms')}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-800 border-slate-700"
                    />
                  </label>

                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs uppercase hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg shadow-purple-500/30 transition-all"
                >
                  {editingSubAdmin ? 'Update Authorization' : 'Save Sub-Admin Account'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
