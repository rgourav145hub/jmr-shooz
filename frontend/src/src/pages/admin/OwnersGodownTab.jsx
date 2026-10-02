import { Building2, Save, Trash2, ShieldCheck, Mail, Phone, Users, Plus, CheckCircle, RotateCcw, Eye, ImageIcon, Upload, X, MapPin, CreditCard, Download, Warehouse } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const OwnersGodownTab = (props) => {
  const { 
    OWNER_AVATAR_PRESETS,
    activeTab, 
    threeOwnersSuccess, 
    handleSaveThreeOwners, 
    handleThreeGodownFieldChange, 
    threeOwnersData,
    handleResetThreeOwners, 
    handleThreeOwnerFieldChange
  } = props;
  
  return (
    <>
{/* TAB 6: 3 OWNERS & GODOWN HUB SETTINGS */}
        {activeTab === 'owners' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header info & actions */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Executive Governance & Central Logistics</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">3 Managing Partners & Central Distribution Godown</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Manage the 3 business owners (Name, Designation, Phone, Email) and the central distribution godown facility address displayed across Home and Owner pages.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {setCurrentView && (
                  <button
                    type="button"
                    onClick={() => setCurrentView('owner')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-brand-gold font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Owner Page</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleResetThreeOwners}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Default</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveThreeOwners}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save 3 Owners & Godown</span>
                </button>
              </div>
            </div>

            {threeOwnersSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>All 3 Owners and Godown Hub details saved successfully! Updates are live across the Home page and Owner page.</span>
              </div>
            )}

            <form onSubmit={handleSaveThreeOwners} className="space-y-8">
              
              {/* SECTION 1: 3 OWNERS (3 DEDICATED COLUMNS) */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-brand-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>3 Business Owners & Managing Partners</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Each column represents one of the 3 business owners with their direct phone, email, and photo.
                    </p>
                  </div>
                  <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                    3 Columns
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {(threeOwnersData.owners || []).map((owner, idx) => (
                    <div
                      key={owner.id || idx}
                      className="bg-brand-card/80 rounded-2xl border border-brand-gold/30 p-5 space-y-4 hover:border-brand-gold/60 transition-colors shadow-lg"
                    >
                      {/* Column Header & Avatar Preview */}
                      <div className="flex items-center gap-3 pb-3 border-b border-brand-border/60">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-brand-gold/60 bg-brand-dark shrink-0">
                          <img
                            src={owner.photo}
                            alt={owner.name}
                            className="w-full h-full object-cover grayscale contrast-105"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold block">
                            OWNER #{idx + 1}
                          </span>
                          <h5 className="font-bold text-white text-sm truncate">
                            {owner.name || `Owner ${idx + 1}`}
                          </h5>
                          <span className="text-[11px] text-slate-400 truncate block">
                            {owner.role || 'Partner'}
                          </span>
                        </div>
                      </div>

                      {/* Photo Preset Buttons */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-semibold text-slate-300">Photo URL</label>
                          <span className="text-[10px] text-slate-400">Presets:</span>
                        </div>
                        <input
                          type="url"
                          value={owner.photo || ''}
                          onChange={(e) => handleThreeOwnerFieldChange(idx, 'photo', e.target.value)}
                          placeholder="Paste photo URL"
                          className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-mono"
                        />
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {OWNER_AVATAR_PRESETS.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleThreeOwnerFieldChange(idx, 'photo', preset.url)}
                              className="px-2 py-0.5 rounded bg-brand-dark hover:bg-brand-gold/20 text-[10px] text-brand-gold border border-brand-border/60"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name & Designation */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Owner Full Name <span className="text-brand-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={owner.name || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'name', e.target.value)}
                            placeholder="e.g. Full Name"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-bold focus:outline-none focus:border-brand-gold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Designation / Role <span className="text-brand-gold">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={owner.role || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'role', e.target.value)}
                            placeholder="e.g. Partner — Sourcing & Licencing"
                            className="w-full px-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                          />
                        </div>
                      </div>

                      {/* Contact Phone & Email */}
                      <div className="space-y-3 pt-2 border-t border-brand-border/50">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Direct Contact Phone / WhatsApp <span className="text-brand-gold">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-muted" />
                            <input
                              type="text"
                              required
                              value={owner.phone || ''}
                              onChange={(e) => handleThreeOwnerFieldChange(idx, 'phone', e.target.value)}
                              placeholder="+91 98200 12345"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            Official Direct Email ID <span className="text-brand-gold">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-brand-muted" />
                            <input
                              type="email"
                              required
                              value={owner.email || ''}
                              onChange={(e) => handleThreeOwnerFieldChange(idx, 'email', e.target.value)}
                              placeholder="owner@jmrshooz.com"
                              className="w-full pl-9 pr-3 py-2 rounded-xl bg-brand-dark border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Experience & Division */}
                      <div className="space-y-2 pt-2 border-t border-brand-border/50">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Experience</label>
                          <input
                            type="text"
                            value={owner.experience || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'experience', e.target.value)}
                            placeholder="e.g. 20+ Years Veteran"
                            className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Core Responsibility</label>
                          <input
                            type="text"
                            value={owner.division || ''}
                            onChange={(e) => handleThreeOwnerFieldChange(idx, 'division', e.target.value)}
                            placeholder="e.g. Supply Chain & Operations"
                            className="w-full px-3 py-1.5 rounded-lg bg-brand-dark border border-brand-border text-white text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: CENTRAL GODOWN & LOGISTICS HUB */}
              <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xl space-y-6">
                <div className="border-b border-brand-border/80 pb-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                    <Warehouse className="w-4 h-4" />
                    <span>Central Distribution Godown & Logistics Hub Address</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter the physical address, storage capacity, helpline contact, and dispatch specifications of the central distribution warehouse.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Facility / Godown Hub Name <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.facilityName || ''}
                        onChange={(e) => handleThreeGodownFieldChange('facilityName', e.target.value)}
                        placeholder="e.g. JMR Shooz Central Distribution Godown & Logistics Hub"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Prominent Landmark
                      </label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.landmark || ''}
                        onChange={(e) => handleThreeGodownFieldChange('landmark', e.target.value)}
                        placeholder="e.g. Opposite State Freight Terminal & Container Depot"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Physical Street Address <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={threeOwnersData.godown?.address || ''}
                      onChange={(e) => handleThreeGodownFieldChange('address', e.target.value)}
                      placeholder="e.g. Plot No. 42-45, Sector-8, Footwear & Leather Complex, Phase-II, Udyog Vihar"
                      className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        City <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.city || ''}
                        onChange={(e) => handleThreeGodownFieldChange('city', e.target.value)}
                        placeholder="e.g. New Delhi"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        State / Region <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.state || ''}
                        onChange={(e) => handleThreeGodownFieldChange('state', e.target.value)}
                        placeholder="e.g. Delhi NCR"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Postal Pincode <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={threeOwnersData.godown?.pincode || ''}
                        onChange={(e) => handleThreeGodownFieldChange('pincode', e.target.value)}
                        placeholder="e.g. 110041"
                        className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-border/60">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Godown Direct Helpline Phone <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" />
                        <input
                          type="text"
                          required
                          value={threeOwnersData.godown?.contactPhone || ''}
                          onChange={(e) => handleThreeGodownFieldChange('contactPhone', e.target.value)}
                          placeholder="+91 98200 99887"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Godown Official Email ID <span className="text-brand-gold">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-brand-muted" />
                        <input
                          type="email"
                          required
                          value={threeOwnersData.godown?.email || ''}
                          onChange={(e) => handleThreeGodownFieldChange('email', e.target.value)}
                          placeholder="godown@jmrshooz.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono focus:outline-none focus:border-brand-gold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Storage Capacity</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.storageCapacity || ''}
                        onChange={(e) => handleThreeGodownFieldChange('storageCapacity', e.target.value)}
                        placeholder="e.g. 1,50,000+ Master Cartons"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Working Hours</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.workingHours || ''}
                        onChange={(e) => handleThreeGodownFieldChange('workingHours', e.target.value)}
                        placeholder="Mon-Sat: 9 AM - 8 PM"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Dispatch Turnaround</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.dispatchTime || ''}
                        onChange={(e) => handleThreeGodownFieldChange('dispatchTime', e.target.value)}
                        placeholder="e.g. 24-48 Hours Express"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">Superintendent In-Charge</label>
                      <input
                        type="text"
                        value={threeOwnersData.godown?.godownInCharge || ''}
                        onChange={(e) => handleThreeGodownFieldChange('godownInCharge', e.target.value)}
                        placeholder="e.g. Rameshwar Dayal"
                        className="w-full px-4 py-2 rounded-xl bg-brand-card border border-brand-border text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
    </>
  );
};

export default OwnersGodownTab;
