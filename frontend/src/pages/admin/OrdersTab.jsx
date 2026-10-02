import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Package, 
  AlertCircle, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  FileText, 
  Eye, 
  X, 
  Printer, 
  Calendar,
  Building2,
  ChevronDown
} from 'lucide-react';
import { apiUpdateOrderStatus } from '../../services/api';
import { addNotification } from '../../utils/notifications';

const STATUS_COLORS = {
  'Pending': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  'Confirmed': 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Processing': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'Dispatched': 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  'Shipped': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  'Hold': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  'Delivered': 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Cancelled': 'bg-red-500/15 text-red-400 border-red-500/30'
};

export default function OrdersTab({ orders = [], onOrderUpdated, onNotification }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Status Counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter(o => o.status === 'Pending').length,
      confirmed: orders.filter(o => o.status === 'Confirmed').length,
      processing: orders.filter(o => o.status === 'Processing').length,
      dispatched: orders.filter(o => o.status === 'Dispatched').length,
      shipped: orders.filter(o => o.status === 'Shipped').length,
      hold: orders.filter(o => o.status === 'Hold').length,
      delivered: orders.filter(o => o.status === 'Delivered').length,
      cancelled: orders.filter(o => o.status === 'Cancelled').length
    };
  }, [orders]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchStatus = statusFilter === 'All' || order.status?.toLowerCase() === statusFilter.toLowerCase();
      const q = search.trim().toLowerCase();
      if (!q) return matchStatus;

      const matchSearch = 
        order.orderId?.toLowerCase().includes(q) ||
        order.id?.toLowerCase().includes(q) ||
        order.customerName?.toLowerCase().includes(q) ||
        order.companyName?.toLowerCase().includes(q) ||
        order.customerPhone?.toLowerCase().includes(q) ||
        order.customerEmail?.toLowerCase().includes(q) ||
        order.city?.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await apiUpdateOrderStatus(orderId, newStatus, adminNoteInput);
      setUpdatingId(null);
      if (res.success) {
        const targetOrder = orders.find(o => o.id === orderId || o.orderId === orderId);

        // Push in-app notification for retailer
        addNotification({
          recipientRole: 'retailer',
          recipientId: targetOrder?.userId || targetOrder?.retailerId || '',
          title: `Order Status: ${newStatus}`,
          message: `Aapke order #${orderId} ka status update hokar "${newStatus}" ho gaya hai.${adminNoteInput ? ' Note: ' + adminNoteInput : ''}`,
          type: 'status',
          data: { orderId, status: newStatus },
          link: '/retailer'
        });

        // Push in-app notification for Admin
        addNotification({
          recipientRole: 'admin',
          title: `Order #${orderId} Marked as ${newStatus}`,
          message: `Status updated to ${newStatus}. Customer notification email sent.`,
          type: 'order',
          data: { orderId, status: newStatus },
          link: '/admin?tab=orders'
        });

        if (onNotification) {
          onNotification({
            message: `Order #${orderId} Updated`,
            subtext: `Status changed to ${newStatus}. Notification & email dispatched.`
          });
        }
        if (onOrderUpdated) {
          onOrderUpdated(orderId, newStatus);
        }
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.orderId === orderId)) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      setUpdatingId(null);
      if (onNotification) {
        onNotification({
          message: 'Update Failed',
          subtext: 'Could not update order status.'
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Overview KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-brand-card/70 border border-brand-border p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Wholesale Orders</span>
            <ShoppingBag className="w-4 h-4 text-brand-gold" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{counts.all}</p>
          <span className="text-[11px] text-slate-400">Total Volume: ₹{totalRevenue.toLocaleString('en-IN')}</span>
        </div>

        <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1">
            <span>Pending Processing</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{counts.pending}</p>
          <span className="text-[11px] text-amber-300/80">Requires Confirmation</span>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-indigo-300 text-xs mb-1">
            <span>In-Transit / Dispatched</span>
            <Truck className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-indigo-300 font-mono">{counts.dispatched}</p>
          <span className="text-[11px] text-indigo-300/80">En route via Hub Cargo</span>
        </div>

        <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span>Fulfilled / Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{counts.delivered}</p>
          <span className="text-[11px] text-emerald-300/80">Completed Deliveries</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-brand-card/60 border border-brand-border p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, Store, Name, Phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-brand-surface border border-brand-border text-white text-xs focus:outline-none focus:border-brand-gold transition-colors"
          />
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['All', 'Pending', 'Confirmed', 'Processing', 'Dispatched', 'Shipped', 'Hold', 'Delivered', 'Cancelled'].map(st => {
            const count = st === 'All' ? counts.all : counts[st.toLowerCase()] || 0;
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-brand-gold text-brand-dark shadow-gold-sm'
                    : 'bg-brand-surface text-slate-400 hover:text-white border border-brand-border'
                }`}
              >
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-black/20 text-brand-dark font-black' : 'bg-brand-card text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-brand-card/40 border border-brand-border rounded-2xl space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No Orders Found</h4>
          <p className="text-xs text-slate-400">
            {search ? 'Try adjusting your search query.' : `No orders in "${statusFilter}" category.`}
          </p>
        </div>
      ) : (
        <div className="bg-brand-card/70 border border-brand-border rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-dark/90 border-b border-brand-border text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Party & Station</th>
                  <th className="py-3.5 px-4">Sets & Pairs</th>
                  <th className="py-3.5 px-4">Grand Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status & Action</th>
                  <th className="py-3.5 px-4 text-right">Consignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filteredOrders.map(order => {
                  const items = Array.isArray(order.items) ? order.items : [];
                  const isUpdating = updatingId === (order.id || order.orderId);
                  const totalSets = order.totalSets || order.totalItems || items.reduce((s, it) => s + (it.sets || it.quantity || 1), 0);
                  const totalPairs = order.totalPairs || items.reduce((s, it) => s + (it.totalPairs || ((it.sets || it.quantity || 1) * (it.pairsPerSet || 12))), 0);

                  return (
                    <tr key={order.id || order.orderId} className="hover:bg-brand-surface/50 transition-colors">
                      {/* Order Ref & Date */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-brand-gold text-sm block">
                          #{order.orderId || order.id}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently'}</span>
                        </span>
                        {order.retailerId && (
                          <span className="inline-block mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/40 border border-brand-border text-slate-400">
                            {order.retailerId}
                          </span>
                        )}
                      </td>

                      {/* Party & Station Info */}
                      <td className="py-4 px-4 align-top">
                        <strong className="text-white font-bold block text-sm">{order.partyName || order.companyName || 'Retail Store'}</strong>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 font-bold text-[10px] border border-amber-400/20">
                            📍 {order.station || order.city || 'Central Hub'}
                          </span>
                          <span className="text-slate-300 text-[11px]">({order.customerName})</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {order.customerPhone && (
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="text-[11px] text-brand-gold hover:underline flex items-center gap-0.5 font-mono"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{order.customerPhone}</span>
                            </a>
                          )}
                          {order.customerEmail && (
                            <>
                              <span className="text-slate-500">•</span>
                              <span className="text-[10px] text-slate-400 truncate max-w-[120px]">{order.customerEmail}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Sets & Pairs */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-bold text-white block text-sm">
                          {totalSets} Sets
                        </span>
                        <span className="text-xs text-brand-gold font-mono font-bold block">
                          ({totalPairs} Pairs)
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 max-w-[180px] mt-0.5" title={items.map(i => `${i.name} (${i.color || 'Standard'}, ${i.pairsPerSet || 12}p/set)`).join(', ')}>
                          {items.length} footwear articles
                        </span>
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          {items.slice(0, 3).map((it, idx) => (
                            <div key={idx} className="relative group" title={`${it.name} • Color: ${it.color || it.selectedColor || 'Classic Black'}`}>
                              <img
                                src={it.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=60'}
                                alt={it.name}
                                className="w-7 h-7 rounded-md object-contain bg-black/40 border border-brand-border/60"
                              />
                            </div>
                          ))}
                          {items.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-mono">+{items.length - 3}</span>
                          )}
                        </div>
                      </td>

                      {/* Grand Total */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-white text-sm block">
                          ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold">Wholesale Bilti Value</span>
                      </td>

                      {/* Payment */}
                      <td className="py-4 px-4 align-top">
                        <span className="px-2 py-0.5 rounded-lg bg-brand-surface border border-brand-border text-slate-300 text-[10px] font-medium block w-max">
                          {order.paymentMethod || 'Bank Transfer'}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider w-max ${STATUS_COLORS[order.status] || STATUS_COLORS['Pending']}`}>
                            {order.status || 'Pending'}
                          </span>

                          <select
                            disabled={isUpdating}
                            value={order.status || 'Pending'}
                            onChange={(e) => handleStatusChange(order.id || order.orderId, e.target.value)}
                            className="text-[11px] py-1 px-2 rounded-lg bg-brand-surface border border-brand-border text-slate-200 focus:outline-none focus:border-brand-gold cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Hold">Hold</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1.5 rounded-xl bg-brand-surface hover:bg-brand-card border border-brand-border text-brand-gold font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Bilti Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL ORDER INVOICE DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-brand-surface border border-brand-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95">
            
            {/* Modal Top Header */}
            <div className="px-6 py-4 bg-brand-dark border-b border-brand-border flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Wholesale Consignment Dispatch Slip</span>
                  <span className="font-mono text-brand-gold">#{selectedOrder.orderId || selectedOrder.id}</span>
                </h3>
                <p className="text-[11px] text-slate-400">JMR Shooz B2B Distribution Enterprise · Direct Factory Allocation</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-gold-sm"
                  title="Print Consignment Bilti"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-xl bg-brand-card text-slate-300 hover:text-white border border-brand-border cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Buyer & Shipping Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-card/70 border border-brand-border">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Party & Retailer Particulars</span>
                  <p className="text-base font-black text-white">{selectedOrder.partyName || selectedOrder.companyName || 'Retail Store'}</p>
                  <p className="text-slate-300 font-medium">Contact: {selectedOrder.customerName}</p>
                  <p className="text-brand-gold font-mono font-bold">Ph: {selectedOrder.customerPhone}</p>
                  <p className="text-slate-400">Email: {selectedOrder.customerEmail}</p>
                  <p className="text-slate-400 font-mono text-[11px]">Retailer ID: <strong className="text-slate-200">{selectedOrder.retailerId || selectedOrder.userId || 'N/A'}</strong></p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Destination & Dispatch Logistics</span>
                  <div className="p-2 rounded-xl bg-black/40 border border-brand-border">
                    <span className="text-[10px] text-slate-400 block uppercase">Destination Station:</span>
                    <p className="text-base font-bold text-amber-300">📍 {selectedOrder.station || selectedOrder.city || 'Central Hub'}</p>
                  </div>
                  <p className="text-slate-200 font-medium mt-1">Delivery Address: {selectedOrder.shippingAddress}</p>
                  <p className="text-slate-400">Payment: <strong className="text-emerald-400">{selectedOrder.paymentMethod}</strong></p>
                  {selectedOrder.notes && (
                    <p className="text-amber-300 text-[11px] bg-amber-950/20 p-2 rounded-xl border border-amber-500/20 mt-1">
                      Transport Note: {selectedOrder.notes}
                    </p>
                  )}
                  {selectedOrder.specification && (
                    <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block mb-0.5">
                        📝 Consignment Specification / विशेष निर्देश:
                      </span>
                      <p className="text-xs text-indigo-100 font-medium">{selectedOrder.specification}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Wholesale Set Packing & Articles Allocation</h4>
                <div className="border border-brand-border rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-dark text-slate-400 text-[10px] uppercase border-b border-brand-border">
                        <th className="p-2.5 text-center w-12">Photo</th>
                        <th className="p-2.5">Item & Color</th>
                        <th className="p-2.5">Curve</th>
                        <th className="p-2.5 text-center">Pairs/Set</th>
                        <th className="p-2.5 text-center">Sets</th>
                        <th className="p-2.5 text-center">Total Pairs</th>
                        <th className="p-2.5 text-right">Rate/Pair</th>
                        <th className="p-2.5 text-right">Rate/Set</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60">
                      {(selectedOrder.items || []).map((it, idx) => {
                        const pairsPerSet = it.pairsPerSet || 12;
                        const ratePerPair = it.ratePerPair || it.wholesaleRate || 750;
                        const ratePerSet = it.ratePerSet || (pairsPerSet * ratePerPair);
                        const sets = it.sets || it.quantity || 1;
                        const totalPairs = it.totalPairs || (sets * pairsPerSet);
                        const subtotal = it.subtotal || (sets * ratePerSet);
                        const itemColor = it.color || it.selectedColor || 'Classic Black';

                        return (
                          <tr key={idx} className="hover:bg-brand-surface/40">
                            <td className="p-2.5 text-center">
                              <img 
                                src={it.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=80'} 
                                alt={it.name}
                                className="w-10 h-10 rounded-lg object-contain bg-black/40 border border-brand-border/60 mx-auto" 
                              />
                            </td>
                            <td className="p-2.5">
                              <span className="font-bold text-white block">{it.name}</span>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-brand-gold">{it.brandName} · SKU: {it.sku}</span>
                                <span className="px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300 font-bold text-[9px] border border-amber-400/20">
                                  🎨 {itemColor}
                                </span>
                              </div>
                              {it.specification && (
                                <div className="mt-1 text-[10px] text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30">
                                  <strong>निर्देश:</strong> {it.specification}
                                </div>
                              )}
                            </td>
                            <td className="p-2.5 text-[10px] text-slate-400 font-mono">{it.sizeCurve || 'Standard'}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-amber-300">{pairsPerSet}</td>
                            <td className="p-2.5 text-center font-mono font-black text-white">{sets}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-sky-400">{totalPairs}</td>
                            <td className="p-2.5 text-right font-mono text-slate-300">₹{ratePerPair.toLocaleString('en-IN')}</td>
                            <td className="p-2.5 text-right font-mono text-slate-200 font-bold">₹{ratePerSet.toLocaleString('en-IN')}</td>
                            <td className="p-2.5 text-right font-mono font-black text-brand-gold">₹{subtotal.toLocaleString('en-IN')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-brand-dark border-t-2 border-brand-gold/60 font-bold">
                        <td colSpan={4} className="p-3 text-right text-white uppercase text-[11px]">Consignment Totals:</td>
                        <td className="p-3 text-center text-white font-mono font-black">{selectedOrder.totalSets || (selectedOrder.items || []).reduce((s, it) => s + (it.sets || it.quantity || 1), 0)} Sets</td>
                        <td className="p-3 text-center text-sky-400 font-mono font-black">{selectedOrder.totalPairs || (selectedOrder.items || []).reduce((s, it) => s + (it.totalPairs || ((it.sets || it.quantity || 1) * (it.pairsPerSet || 12))), 0)} Pairs</td>
                        <td colSpan={2} className="p-3 text-right text-white">Grand Total:</td>
                        <td className="p-3 text-right font-black font-mono text-brand-gold text-base">
                          ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="p-4 rounded-2xl bg-brand-card/90 border border-brand-gold/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Change Order Status:</span>
                  <span className="text-xs text-white">Updating status automatically emails the customer.</span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status || 'Pending'}
                    onChange={(e) => handleStatusChange(selectedOrder.id || selectedOrder.orderId, e.target.value)}
                    className="py-2 px-3 rounded-xl bg-brand-surface border border-brand-border text-white text-xs font-bold focus:outline-none focus:border-brand-gold cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Hold">Hold</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleStatusChange(selectedOrder.id || selectedOrder.orderId, selectedOrder.status === 'Pending' ? 'Confirmed' : 'Dispatched')}
                    className="px-3.5 py-2 rounded-xl bg-brand-gold text-brand-dark font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-gold-sm transition-all cursor-pointer"
                  >
                    {selectedOrder.status === 'Pending' ? 'Confirm Order' : 'Mark Dispatched'}
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
