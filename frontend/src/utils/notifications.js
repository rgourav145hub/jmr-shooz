/**
 * In-App Notification Manager for JMR Shooz
 * Handles real-time in-app alerts for Admin and Retailers / Customers
 */

const NOTIFICATIONS_KEY = 'jmr_notifications_v1';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-ord-seed-1',
    recipientRole: 'admin',
    recipientId: 'all',
    type: 'order',
    title: '🔔 New Wholesale Order Received',
    message: 'ROYAL SHOE EMPORIUM (INDORE) booked 3 Sets (36 Pairs) of Liberty & Columbus articles · ₹41,400',
    link: '/admin?tab=orders',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() // 15 mins ago
  },
  {
    id: 'notif-query-seed-1',
    recipientRole: 'admin',
    recipientId: 'all',
    type: 'query',
    title: '💬 New Wholesale Trade Inquiry',
    message: 'Metro Footwear Salon (New Delhi) requested dispatch timeline for Liberty Force 10 assortment.',
    link: '/admin?tab=queries',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
  },
  {
    id: 'notif-ret-seed-1',
    recipientRole: 'retailer',
    recipientId: 'all',
    type: 'status',
    title: '📦 Wholesale Order Status Update',
    message: 'Your order #ORD-2026-8815 has been confirmed by JMR Central Logistics Desk.',
    link: '/retailer',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  }
];

export function getStoredNotifications(userRole = '', userId = '') {
  try {
    // Privacy & Security: If not logged in, NEVER return notifications
    if (!userRole) return [];

    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    let list = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (!Array.isArray(list)) list = INITIAL_NOTIFICATIONS;

    const cleanUserId = String(userId || '').trim().toLowerCase();

    return list.filter(n => {
      // 1. Admin ONLY sees Admin-directed notifications
      if (userRole === 'admin') {
        return n.recipientRole === 'admin';
      }

      // 2. Retailer ONLY sees Retailer-directed notifications addressed to them
      if (userRole === 'retailer') {
        if (n.recipientRole !== 'retailer') return false;
        if (!n.recipientId || n.recipientId === 'all') return true;
        const notifRecipient = String(n.recipientId).trim().toLowerCase();
        return cleanUserId && (notifRecipient === cleanUserId);
      }

      return false;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    return [];
  }
}

export function addNotification({ recipientRole = 'admin', recipientId = 'all', type = 'order', title, message, link = '' }) {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    const list = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;

    const newNotif = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientRole,
      recipientId: String(recipientId || 'all'),
      type,
      title,
      message,
      link,
      isRead: false,
      createdAt: new Date().toISOString()
    };

    const updated = [newNotif, ...list.slice(0, 49)]; // keep latest 50
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jmr_notifications_updated'));
    return newNotif;
  } catch (e) {
    console.error('Failed to save notification:', e);
    return null;
  }
}

export function markNotificationAsRead(id) {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return;
    const list = JSON.parse(raw);
    const updated = list.map(n => n.id === id ? { ...n, isRead: true } : n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jmr_notifications_updated'));
  } catch (e) {}
}

export function markAllNotificationsAsRead(userRole = '', userId = '') {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return;
    const list = JSON.parse(raw);
    const updated = list.map(n => {
      let isForUser = true;
      if (userRole === 'admin' && n.recipientRole !== 'admin') isForUser = false;
      if (userRole === 'retailer' && n.recipientRole !== 'retailer') isForUser = false;
      return isForUser ? { ...n, isRead: true } : n;
    });
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('jmr_notifications_updated'));
  } catch (e) {}
}
