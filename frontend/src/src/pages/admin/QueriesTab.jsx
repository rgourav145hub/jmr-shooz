import React from 'react';
import { Store } from 'lucide-react';

const QueriesTab = ({ activeTab, handleStatusChange, queries }) => {
  return (
    <>
{/* TAB 3: QUERIES & FEEDBACK DESK */}
        {activeTab === 'queries' && (
          <div className="bg-brand-surface rounded-2xl border border-brand-border overflow-hidden shadow-xl">
            <div className="p-5 border-b border-brand-border">
              <h3 className="font-bold text-white text-base">Incoming Retailer Inquiries, Orders & Feedback</h3>
              <p className="text-xs text-brand-muted mt-0.5">Review stock requests, custom curve orders, and distributor feedback.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-brand-card/60 text-brand-muted uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Ticket Ref</th>
                    <th className="py-3 px-4">Retailer Store</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Brand / SKU</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {queries.map((q) => (
                    <tr key={q.id} className="hover:bg-brand-card/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-brand-gold">{q.id}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-white block">{q.companyName || 'Retail Stockist'}</span>
                        <span className="text-[10px] text-brand-muted">{q.contactName} ({q.phone})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-card text-slate-200 border border-brand-border">
                          {q.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-brand-gold">{q.brandName}</td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-semibold text-white block line-clamp-1">{q.subject}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-2">{q.message}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                          q.status === 'Resolved'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : q.status === 'In Review'
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                            : 'bg-blue-950/60 text-blue-300 border border-blue-800'
                        }`}>
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <select
                          value={q.status}
                          onChange={(e) => handleStatusChange(q.id, e.target.value)}
                          className="px-2 py-1 rounded bg-brand-card border border-brand-border text-[11px] text-slate-200 focus:outline-none focus:border-brand-gold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Resolved">Resolved</option>
                        </select>
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

export default QueriesTab;
