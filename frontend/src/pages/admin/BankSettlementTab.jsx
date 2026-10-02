import React from 'react';
import { Building2, Save, Trash2, ShieldCheck, Mail, Phone, Users, Plus, CheckCircle, RotateCcw, Eye, ImageIcon, Upload, X, MapPin, CreditCard, Download, Check } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

const BankSettlementTab = (props) => {
  const { 
    activeTab, 
    bankSaveSuccess, 
    companyBank, 
    handleCompanyBankChange, 
    handleResetCompanyBank, 
    handleSaveCompanyBank
  } = props;
  
  return (
    <>
{/* TAB 7: BANK & GST SETTLEMENT MANAGEMENT */}
        {activeTab === 'bank' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header info & actions */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-bold uppercase tracking-widest border border-brand-gold/30 mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Commercial Banking & GST Verification</span>
                </div>
                <h3 className="font-display text-xl font-bold text-white">Bank Settlement & Retailer GST Invoicing Hub</h3>
                <p className="text-xs text-brand-muted mt-1">
                  Configure official company wholesale remittance bank coordinates and review registered retailer GSTINs stored in the SQLite database.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetCompanyBank}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveCompanyBank}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-brand-gold-dark text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Bank Coordinates</span>
                </button>
              </div>
            </div>

            {bankSaveSuccess && (
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs font-medium animate-in fade-in">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Company bank details saved successfully to the SQLite database! Live for all retailers.</span>
              </div>
            )}

            {/* SECTION 1: EDIT OFFICIAL COMPANY SETTLEMENT ACCOUNT */}
            <form onSubmit={handleSaveCompanyBank} className="bg-brand-surface rounded-2xl border border-brand-gold/40 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="border-b border-brand-border/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-brand-gold flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Official Company Wholesale Collection Bank Account</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Retailers see these bank details on their wholesale portal for RTGS, NEFT, IMPS, and UPI transfers.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  SQLite Synced
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Beneficiary Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.accountName || ''}
                    onChange={(e) => handleCompanyBankChange('accountName', e.target.value)}
                    placeholder="e.g. JMR SHOOZ DISTRIBUTION PRIVATE LIMITED"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-bold focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bank Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.bankName || ''}
                    onChange={(e) => handleCompanyBankChange('bankName', e.target.value)}
                    placeholder="e.g. HDFC Bank, ICICI, SBI"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Bank Account Number <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.accountNumber || ''}
                    onChange={(e) => handleCompanyBankChange('accountNumber', e.target.value)}
                    placeholder="e.g. 50200084920194"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono font-bold text-brand-gold focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    IFSC Code <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.ifscCode || ''}
                    onChange={(e) => handleCompanyBankChange('ifscCode', e.target.value.toUpperCase())}
                    placeholder="e.g. HDFC0000128"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Type <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.accountType || ''}
                    onChange={(e) => handleCompanyBankChange('accountType', e.target.value)}
                    placeholder="e.g. Current Account"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official UPI ID
                  </label>
                  <input
                    type="text"
                    value={companyBank.upiId || ''}
                    onChange={(e) => handleCompanyBankChange('upiId', e.target.value)}
                    placeholder="e.g. jmrshooz@hdfcbank"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono text-emerald-400 focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Distributor GSTIN <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyBank.companyGstin || ''}
                    onChange={(e) => handleCompanyBankChange('companyGstin', e.target.value.toUpperCase())}
                    placeholder="e.g. 07AAACJ1234F1Z8"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Company PAN Number
                  </label>
                  <input
                    type="text"
                    value={companyBank.companyPan || ''}
                    onChange={(e) => handleCompanyBankChange('companyPan', e.target.value.toUpperCase())}
                    placeholder="e.g. AAACJ1234F"
                    className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs font-mono uppercase focus:outline-none focus:border-brand-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Bank Branch Name & Full Address
                </label>
                <input
                  type="text"
                  value={companyBank.branch || ''}
                  onChange={(e) => handleCompanyBankChange('branch', e.target.value)}
                  placeholder="e.g. Kirti Nagar Footwear Commercial Complex, New Delhi - 110015"
                  className="w-full px-4 py-2.5 rounded-xl bg-brand-card border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Update & Save to Database</span>
                </button>
              </div>
            </form>

            {/* SECTION 2: RETAILERS GST & BANK DIRECTORY */}
            <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
              <div className="p-5 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">Registered Retailers GST & Bank Account Directory</h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Live retailer billing coordinates retrieved from the central SQLite database.
                  </p>
                </div>
                <span className="text-xs font-mono text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                  {retailersList.length} Accounts
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Retailer / Store</th>
                      <th className="py-3.5 px-4">Retailer ID</th>
                      <th className="py-3.5 px-4">GSTIN (GST No.)</th>
                      <th className="py-3.5 px-4">Settlement Bank</th>
                      <th className="py-3.5 px-4">Account Number</th>
                      <th className="py-3.5 px-4">IFSC Code</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/60">
                    {retailersList.map((r) => (
                      <tr key={r.id} className="hover:bg-brand-card/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-xs">{r.companyName || r.name}</div>
                          <div className="text-[11px] text-slate-400">{r.name} • {r.city || 'India'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-brand-gold font-bold text-xs">
                          {r.retailerId || r.id}
                        </td>
                        <td className="py-3.5 px-4">
                          {r.gstin ? (
                            <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30 text-[11px]">
                              <Check className="w-3 h-3" />
                              {r.gstin}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">Unregistered</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-white">{r.bankName || 'Not Set'}</span>
                          {r.branch && <div className="text-[10px] text-slate-400">{r.branch}</div>}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-200">
                          {r.accountNo || '—'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          {r.ifsc || '—'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                            {r.status || 'Verified'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default BankSettlementTab;
