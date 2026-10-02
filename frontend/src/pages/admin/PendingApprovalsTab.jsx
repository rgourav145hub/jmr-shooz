import React, { useState, useEffect } from 'react';
import { Check, X, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { apiGetPendingUsers, apiApproveUser, apiRejectUser } from '../../services/api'; // I'll update api.js

export default function PendingApprovalsTab() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await apiGetPendingUsers();
      if (res && !res.error) {
        setPendingUsers(res);
      } else {
        setError(res?.error || 'Failed to fetch pending users');
      }
    } catch (err) {
      setError('Error fetching pending users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      const res = await apiApproveUser(userId);
      if (res && res.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId && u.retailerId !== userId));
      } else {
        alert(res?.error || 'Failed to approve user');
      }
    } catch (err) {
      alert('Error approving user: ' + err.message);
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm('Are you sure you want to reject and remove this account request?')) return;
    try {
      const res = await apiRejectUser(userId);
      if (res && res.success) {
        setPendingUsers(prev => prev.filter(u => u.id !== userId && u.retailerId !== userId));
      } else {
        alert(res?.error || 'Failed to reject user');
      }
    } catch (err) {
      alert('Error rejecting user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-brand-gold animate-pulse text-sm tracking-widest uppercase">Loading pending requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-brand-gold" />
            Pending Approvals
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Review and approve new Retailer and Admin account requests.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm">
          {error}
        </div>
      )}

      {pendingUsers.length === 0 && !error ? (
        <div className="text-center py-20 bg-brand-card/30 rounded-2xl border border-brand-gold/10">
          <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">All caught up!</h3>
          <p className="text-slate-400 mt-1">There are no pending account requests.</p>
        </div>
      ) : (
        <div className="bg-brand-card rounded-xl border border-brand-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-brand-dark/50 text-xs uppercase tracking-wider text-slate-400 border-b border-brand-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">User Details</th>
                  <th className="px-6 py-4 font-semibold">Account Type</th>
                  <th className="px-6 py-4 font-semibold">Business Info</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/50">
                {pendingUsers.map(user => (
                  <tr key={user.id} className="hover:bg-brand-surface/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-xs text-brand-gold">{user.email}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {user.userType === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase border border-purple-500/20">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase border border-blue-500/20">
                          Retailer
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.userType === 'retailer' ? (
                        <>
                          <div className="font-semibold text-white">{user.companyName}</div>
                          {user.gstin && <div className="text-xs text-slate-400 uppercase">GST: {user.gstin}</div>}
                          <div className="text-xs text-slate-500">{user.city}</div>
                        </>
                      ) : (
                        <span className="text-slate-500 italic">System Admin Access</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleApprove(user.id)}
                          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-brand-dark transition-colors border border-emerald-500/20 title='Approve Account'"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleReject(user.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20 title='Reject Account'"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
