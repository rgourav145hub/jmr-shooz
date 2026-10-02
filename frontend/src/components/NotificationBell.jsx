import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Clock, 
  Package, 
  MessageSquare, 
  AlertCircle, 
  X, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  getStoredNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../utils/notifications';
import { useAuth } from '../contexts/AuthContext';

export default function NotificationBell({ className = '' }) {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  if (!currentUser) return null;

  const userRole = isAdmin ? 'admin' : (currentUser ? 'retailer' : '');
  const userId = currentUser?.id || currentUser?.retailerId || '';

  const refreshNotifications = () => {
    const list = getStoredNotifications(userRole, userId);
    setNotifications(list);
  };

  useEffect(() => {
    refreshNotifications();

    const handleUpdate = () => refreshNotifications();
    window.addEventListener('jmr_notifications_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('jmr_notifications_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [userRole, userId]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (n) => {
    markNotificationAsRead(n.id);
    setIsOpen(false);
    if (n.link) {
      navigate(n.link);
    }
  };

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    markAllNotificationsAsRead(userRole, userId);
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Just now';
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-brand-surface hover:bg-brand-card border border-brand-border text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
        title="View Notifications"
      >
        <Bell className="w-4 h-4 text-brand-gold" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-surface border border-brand-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="px-4 py-3 bg-brand-dark border-b border-brand-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-brand-gold hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-brand-border/50 text-xs">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-40" />
                <p className="font-medium text-slate-300">No notifications yet</p>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Order updates and inquiry notices will appear here.
                </span>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-brand-card/70 transition-colors cursor-pointer flex gap-3 items-start ${
                    !n.isRead ? 'bg-brand-gold/5' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.type === 'order'
                      ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                      : n.type === 'query'
                      ? 'bg-blue-400/15 text-blue-400 border border-blue-400/30'
                      : 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/30'
                  }`}>
                    {n.type === 'order' ? (
                      <Package className="w-4 h-4" />
                    ) : n.type === 'query' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`font-bold truncate text-[11px] ${!n.isRead ? 'text-white' : 'text-slate-300'}`}>
                        {n.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>

                    {n.link && (
                      <span className="text-[10px] text-brand-gold font-bold flex items-center gap-0.5 mt-1">
                        <span>Open Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-brand-dark/90 border-t border-brand-border/60 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              {isAdmin ? '🛡️ Central Admin Live Alerts' : '🏬 Retailer Store Alerts'}
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
