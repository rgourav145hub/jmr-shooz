import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Building2, 
  Quote, 
  CheckCircle, 
  Briefcase, 
  Users, 
  Star,
  Edit3,
  X,
  Save,
  MapPin,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Warehouse,
  Boxes,
  Clock,
  MessageCircle,
  Truck,
  RotateCcw
} from 'lucide-react';
import { 
  getThreeOwnersAndGodown, 
  saveThreeOwnersAndGodown, 
  resetThreeOwnersAndGodown 
} from '../utils/storage';

const OwnerPage = function({ currentUser: propUser, openAuthModal, openEnquiryModal }) {
  const { currentUser: authUser, isAdmin } = useAuth();
  const currentUser = authUser || propUser;
  const navigate = useNavigate();
  const [data, setData] = useState(() => getThreeOwnersAndGodown());
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(data);
  const [saveToast, setSaveToast] = useState(false);
  const [editTab, setEditTab] = useState('owners'); // 'owners' or 'godown'

  useEffect(() => {
    setData(getThreeOwnersAndGodown());
    setEditForm(getThreeOwnersAndGodown());

    const handleUpdate = () => {
      const updated = getThreeOwnersAndGodown();
      setData(updated);
      setEditForm(updated);
    };

    window.addEventListener('jmr_owners_godown_updated', handleUpdate);
    return () => window.removeEventListener('jmr_owners_godown_updated', handleUpdate);
  }, []);

  const handleOpenEdit = () => {
    setEditForm(data);
    setIsEditing(true);
  };

  const handleOwnerFieldChange = (index, field, value) => {
    setEditForm(prev => {
      const copyOwners = [...(prev.owners || [])];
      copyOwners[index] = { ...copyOwners[index], [field]: value };
      return { ...prev, owners: copyOwners };
    });
  };

  const handleGodownFieldChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      godown: {
        ...(prev.godown || {}),
        [field]: value
      }
    }));
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const saved = saveThreeOwnersAndGodown(editForm);
    setData(saved);
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleReset = () => {
    if (window.confirm('Reset 3 owners and godown details to default?')) {
      const def = resetThreeOwnersAndGodown();
      setData(def);
      setEditForm(def);
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    }
  };

  const owners = data.owners || [];
  const godown = data.godown || {};

  return (
    <div className="min-h-screen bg-brand-dark pt-36 sm:pt-40 md:pt-44 pb-24 text-slate-100">
      
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-brand-surface border border-brand-gold p-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white text-xs animate-in slide-in-from-top-4 duration-300">
          <CheckCircle className="w-5 h-5 text-brand-gold shrink-0" />
          <div>
            <p className="font-bold text-brand-gold">Details Updated Successfully</p>
            <p className="text-slate-300">3 Owners and Godown information updated across the website.</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-gold/30 text-brand-gold text-xs font-semibold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Executive Governance & Distribution Logistics</span>
          </div>
          
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
            3 Managing Partners & Central Godown Hub
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Direct executive leadership overseeing brand procurement, commercial retailer relationships, and our central 1,50,000+ carton distribution godown.
          </p>

          {/* Quick Edit Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {isAdmin && currentUser && (
              <button
                onClick={handleOpenEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-gold border border-brand-gold/40 text-xs font-bold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit 3 Owners & Godown Details</span>
              </button>
            )}

            {isAdmin && currentUser ? (
              <button
                onClick={() => navigate('/admin')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-card text-slate-300 border border-brand-border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>Open Admin Portal</span>
              </button>
            ) : (
              <button
                onClick={() => openAuthModal && openAuthModal('login')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-surface hover:bg-brand-card text-slate-400 hover:text-slate-200 border border-brand-border text-[11px] font-semibold tracking-wider transition-all cursor-pointer"
              >
                <span>Admin Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 1: 3 OWNERS COLUMNS */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-gold">Executive Leadership Roster</span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
            Meet the 3 Partners & Owners
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Each partner directly heads a pillar of JMR Shooz's wholesale footwear enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {owners.map((o, idx) => (
            <div 
              key={o.id || idx}
              className="bg-brand-surface rounded-3xl border border-brand-border hover:border-brand-gold/50 p-6 sm:p-7 shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:shadow-gold-glow/20 relative"
            >
              <div>
                {/* Photo with Luxury Frame */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-brand-card mb-6 border-2 border-brand-border/80 group-hover:border-brand-gold/40 transition-colors">
                  <img
                    src={o.photo}
                    alt={o.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 contrast-105"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/90 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-dark/90 text-brand-gold border border-brand-gold/40 backdrop-blur-md shadow-md">
                      Partner #{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-xs font-mono text-brand-gold font-bold uppercase tracking-wider block">
                      {o.experience || 'Footwear Veteran'}
                    </span>
                  </div>
                </div>

                {/* Identity & Role */}
                <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                  {o.name}
                </h3>
                
                <p className="text-xs font-semibold text-brand-gold uppercase tracking-wider mt-1">
                  {o.role}
                </p>

                <div className="mt-4 p-3.5 rounded-xl bg-brand-card/50 border border-brand-border/60">
                  <span className="text-[10px] uppercase tracking-widest text-brand-muted block font-semibold">Executive Portfolio</span>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {o.division}
                  </p>
                </div>
              </div>

              {/* Direct Owner Contact Column Coordinates */}
              <div className="mt-6 pt-5 border-t border-brand-border/80 space-y-3">
                <div className="flex items-center justify-between text-xs bg-brand-card/70 p-3 rounded-xl border border-brand-border/60">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                    <span className="font-mono text-xs">{o.phone}</span>
                  </div>
                  <a 
                    href={`tel:${o.phone}`}
                    className="px-2.5 py-1 rounded-lg bg-brand-gold/15 text-brand-gold text-[11px] font-bold hover:bg-brand-gold hover:text-brand-dark transition-colors"
                  >
                    Call Now
                  </a>
                </div>

                <div className="flex items-center justify-between text-xs bg-brand-card/70 p-3 rounded-xl border border-brand-border/60">
                  <div className="flex items-center gap-2.5 text-slate-300 overflow-hidden">
                    <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                    <span className="font-mono text-[11px] truncate">{o.email}</span>
                  </div>
                  <a 
                    href={`mailto:${o.email}`}
                    className="px-2.5 py-1 rounded-lg bg-brand-card hover:bg-brand-cardHover text-slate-200 text-[11px] font-semibold border border-brand-border shrink-0 ml-2"
                  >
                    Email
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: CENTRAL GODOWN & LOGISTICS HUB */}
      <div className="max-w-7xl 2xl:max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="bg-gradient-to-br from-brand-surface via-brand-card to-brand-surface rounded-3xl border-2 border-brand-gold/30 p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Godown Details */}
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider">
                <Warehouse className="w-4 h-4" />
                <span>Central Distribution Godown & Dispatch Terminal</span>
              </div>

              <div>
                <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {godown.facilityName || 'JMR Shooz Central Footwear Godown'}
                </h2>
                <p className="text-sm text-brand-muted mt-2">
                  Our primary national footwear consolidation and bulk packaging facility, storing cartons for ready stock dispatches across India.
                </p>
              </div>

              {/* Godown Address & Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* Physical Address Column */}
                <div className="bg-brand-dark/60 p-5 rounded-2xl border border-brand-border/70 space-y-2">
                  <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4" />
                    <span>Physical Godown Address</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {godown.address}
                  </p>
                  <p className="text-xs text-brand-gold font-semibold">
                    {godown.landmark}
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    {godown.city}, {godown.state} — Pin: <span className="text-white font-bold">{godown.pincode}</span>
                  </p>
                </div>

                {/* Logistics Specifications */}
                <div className="bg-brand-dark/60 p-5 rounded-2xl border border-brand-border/70 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-brand-border/50">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Boxes className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Storage Capacity:</span>
                    </span>
                    <strong className="text-brand-gold font-bold text-sm">{godown.storageCapacity}</strong>
                  </div>

                  <div className="flex items-center justify-between pb-2 border-b border-brand-border/50">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Turnaround:</span>
                    </span>
                    <strong className="text-white font-semibold">{godown.dispatchTime}</strong>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      <span>Operational Hours:</span>
                    </span>
                    <span className="text-slate-300 text-right">{godown.workingHours}</span>
                  </div>
                </div>

              </div>

              {/* Godown Contacts Bar */}
              <div className="p-4 rounded-2xl bg-brand-darker/70 border border-brand-border/60 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Godown Dispatch Helpline</span>
                    <a href={`tel:${godown.contactPhone}`} className="font-mono font-bold text-white hover:text-brand-gold transition-colors">
                      {godown.contactPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-gold/15 flex items-center justify-center text-brand-gold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Depot Logistics Email</span>
                    <a href={`mailto:${godown.email}`} className="font-mono font-bold text-white hover:text-brand-gold transition-colors">
                      {godown.email}
                    </a>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Facility In-Charge</span>
                  <span className="font-semibold text-brand-gold">{godown.godownInCharge}</span>
                </div>
              </div>

            </div>

            {/* Right Quick Action Card */}
            <div className="lg:col-span-4 bg-brand-dark/90 p-6 sm:p-8 rounded-3xl border border-brand-gold/30 text-center space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-brand-gold/15 border border-brand-gold flex items-center justify-center text-brand-gold mx-auto shadow-gold-sm">
                <Building2 className="w-6 h-6" />
              </div>

              <h4 className="font-display text-xl font-bold text-white">
                Want to Book Wholesale Cartons from Godown?
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with our 3 managing partners or schedule your wholesale footwear carton pick-up / freight transit.
              </p>

              <button
                onClick={() => openEnquiryModal && openEnquiryModal()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
              >
                Direct Business Enquiry
              </button>

              <button
                onClick={handleOpenEdit}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-card hover:bg-brand-cardHover text-slate-300 text-xs font-semibold border border-brand-border flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-brand-gold" />
                <span>Edit 3 Owners or Godown Data</span>
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* MODAL: INTERACTIVE EDIT 3 OWNERS & GODOWN */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-brand-surface border border-brand-border rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-brand-gold" />
                  <span>Update 3 Owners & Godown Information</span>
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Update any owner's name, phone, email, or the central warehouse godown address.
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-full bg-brand-card text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation sub-tabs */}
            <div className="flex border-b border-brand-border bg-brand-card/40 rounded-t-xl px-4 mb-6 gap-3">
              <button
                type="button"
                onClick={() => setEditTab('owners')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                  editTab === 'owners'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>3 Owners Columns</span>
              </button>

              <button
                type="button"
                onClick={() => setEditTab('godown')}
                className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${
                  editTab === 'godown'
                    ? 'border-brand-gold text-brand-gold'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Warehouse className="w-4 h-4" />
                <span>Godown (Warehouse) Address & Details</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6 text-xs">
              
              {/* TAB 1: 3 OWNERS */}
              {editTab === 'owners' && (
                <div className="space-y-6">
                  {(editForm.owners || []).map((o, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-brand-card/70 border border-brand-border space-y-3">
                      <div className="flex items-center justify-between border-b border-brand-border/60 pb-2">
                        <span className="font-bold text-brand-gold uppercase tracking-wider">
                          Owner #{idx + 1}
                        </span>
                        <span className="text-[11px] text-slate-400">ID: {o.id}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Owner Name *</label>
                          <input
                            type="text"
                            required
                            value={o.name || ''}
                            onChange={(e) => handleOwnerFieldChange(idx, 'name', e.target.value)}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:border-brand-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Designation / Role *</label>
                          <input
                            type="text"
                            required
                            value={o.role || ''}
                            onChange={(e) => handleOwnerFieldChange(idx, 'role', e.target.value)}
                            placeholder="e.g. Managing Partner"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:border-brand-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Contact Phone / WhatsApp *</label>
                          <input
                            type="text"
                            required
                            value={o.phone || ''}
                            onChange={(e) => handleOwnerFieldChange(idx, 'phone', e.target.value)}
                            placeholder="+91 98..."
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-mono focus:border-brand-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Email Address *</label>
                          <input
                            type="email"
                            required
                            value={o.email || ''}
                            onChange={(e) => handleOwnerFieldChange(idx, 'email', e.target.value)}
                            placeholder="email@jmrshooz.com"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-mono focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Experience Credential</label>
                          <input
                            type="text"
                            value={o.experience || ''}
                            onChange={(e) => handleOwnerFieldChange(idx, 'experience', e.target.value)}
                            placeholder="e.g. 20+ Years Footwear Veteran"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:border-brand-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Division / Executive Portfolio</label>
                          <input
                            type="text"
                            value={o.division || ''}
                            onChange={(e) => handleOwnerFieldChange(idx, 'division', e.target.value)}
                            placeholder="e.g. Brand Sourcing & Licencing"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">Portrait Photo URL</label>
                        <input
                          type="url"
                          value={o.photo || ''}
                          onChange={(e) => handleOwnerFieldChange(idx, 'photo', e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:border-brand-gold font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: CENTRAL GODOWN */}
              {editTab === 'godown' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Godown / Warehouse Facility Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.godown?.facilityName || ''}
                      onChange={(e) => handleGodownFieldChange('facilityName', e.target.value)}
                      placeholder="e.g. JMR Shooz Central Distribution Godown"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.godown?.address || ''}
                      onChange={(e) => handleGodownFieldChange('address', e.target.value)}
                      placeholder="Plot No, Complex, Industrial Area"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Landmark</label>
                      <input
                        type="text"
                        value={editForm.godown?.landmark || ''}
                        onChange={(e) => handleGodownFieldChange('landmark', e.target.value)}
                        placeholder="Near Freight Terminal"
                        className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">City & State *</label>
                      <input
                        type="text"
                        required
                        value={editForm.godown?.city || ''}
                        onChange={(e) => handleGodownFieldChange('city', e.target.value)}
                        placeholder="New Delhi, Delhi NCR"
                        className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        value={editForm.godown?.pincode || ''}
                        onChange={(e) => handleGodownFieldChange('pincode', e.target.value)}
                        placeholder="110041"
                        className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Godown Helpline Phone *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.godown?.contactPhone || ''}
                        onChange={(e) => handleGodownFieldChange('contactPhone', e.target.value)}
                        placeholder="+91 98..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Godown Email ID *
                      </label>
                      <input
                        type="email"
                        required
                        value={editForm.godown?.email || ''}
                        onChange={(e) => handleGodownFieldChange('email', e.target.value)}
                        placeholder="godown@jmrshooz.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Storage Capacity</label>
                      <input
                        type="text"
                        value={editForm.godown?.storageCapacity || ''}
                        onChange={(e) => handleGodownFieldChange('storageCapacity', e.target.value)}
                        placeholder="1,50,000+ Cartons"
                        className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs text-brand-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Dispatch Turnaround</label>
                      <input
                        type="text"
                        value={editForm.godown?.dispatchTime || ''}
                        onChange={(e) => handleGodownFieldChange('dispatchTime', e.target.value)}
                        placeholder="24-48 Hours"
                        className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">Facility In-Charge</label>
                      <input
                        type="text"
                        value={editForm.godown?.godownInCharge || ''}
                        onChange={(e) => handleGodownFieldChange('godownInCharge', e.target.value)}
                        placeholder="Depot Manager Name"
                        className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 mb-1">Operating Hours</label>
                    <input
                      type="text"
                      value={editForm.godown?.workingHours || ''}
                      onChange={(e) => handleGodownFieldChange('workingHours', e.target.value)}
                      placeholder="Monday - Saturday: 9:00 AM - 8:00 PM"
                      className="w-full px-3 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-brand-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-brand-gold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl bg-brand-card text-slate-300 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:bg-brand-gold-light shadow-gold-sm cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save 3 Owners & Godown</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default React.memo(OwnerPage);
