import { getRegisteredUsers } from '../../utils/storage';
import React from 'react';
import { Phone, Store } from 'lucide-react';

const RetailersTab = ({ activeTab }) => {
  const safeUsers = Array.isArray(getRegisteredUsers()) ? getRegisteredUsers() : [];
  const retailersList = safeUsers.filter(u => u && (u.userType === 'retailer' || u.accountType === 'retailer') && u.status !== 'pending');
  return (
    <>
{/* TAB 4: REGISTERED RETAILERS DIRECTORY */}
        {activeTab === 'retailers' && (
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-5 border-b border-brand-border">
              <h3 className="font-bold text-white text-base">Authorized Retailer Accounts Directory</h3>
              <p className="text-xs text-brand-muted mt-0.5">Footwear retailers with generated User IDs and trade portal credentials.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Retailer ID</th>
                    <th className="py-3 px-4">Store / Business Name</th>
                    <th className="py-3 px-4">Contact Person</th>
                    <th className="py-3 px-4">City / Location</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">GSTIN / Tax ID</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {retailersList.map((r) => (
                    <tr key={r.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">{r.retailerId || r.id}</td>
                      <td className="py-3.5 px-4 font-bold text-white">{r.companyName || r.name}</td>
                      <td className="py-3.5 px-4 text-slate-200">{r.name}</td>
                      <td className="py-3.5 px-4 text-slate-300">{r.city || 'Regional Outlet'}</td>
                      <td className="py-3.5 px-4 font-mono">{r.phone}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{r.gstin || 'Registered Trade'}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                          {r.status || 'Verified'}
                        </span>
                      </td>
                    </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        

        
      )}
    </>
  );
};

export default RetailersTab;
