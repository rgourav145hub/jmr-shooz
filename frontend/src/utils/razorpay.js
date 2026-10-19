/**
 * JMR Shooz - Razorpay Payment Gateway & Direct UPI Integration Utility
 * Supports UPI (GPay, PhonePe, Paytm, BHIM), NetBanking, Credit/Debit Cards, and Dynamic QR
 */

import { getBankDetails } from './storage';

/**
 * Ensures Razorpay Checkout SDK is loaded in DOM
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Razorpay SDK failed to load from CDN');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay Payment Checkout Modal
 * @param {Object} params
 * @param {number} params.amount - Amount in INR (will be converted to paise)
 * @param {string} params.orderId - Wholesale Consignment / Order ID
 * @param {string} params.partyName - Registered Firm or Buyer Name
 * @param {string} params.customerName - Contact person name
 * @param {string} params.customerEmail - Notification email
 * @param {string} params.customerPhone - Contact phone
 * @param {string} [params.keyId] - Custom Razorpay Key ID
 * @returns {Promise<{success: boolean, paymentId?: string, orderId?: string, signature?: string, error?: string, dismissed?: boolean}>}
 */
export async function openRazorpayCheckout({
  amount,
  orderId,
  partyName = 'Retail Buyer',
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  keyId = null
}) {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Razorpay Checkout SDK is unavailable. Please check your internet connection.');
  }

  const bankDetails = getBankDetails();
  // Preferred Key: Explicit arg -> Configured in Admin Portal -> Environment var -> Safe Fallback Test Key
  const activeKeyId = keyId || 
    bankDetails?.razorpayKeyId || 
    import.meta.env.VITE_RAZORPAY_KEY_ID || 
    'rzp_test_1DP5mmOlF5G5ag';

  const amountInPaise = Math.round(Number(amount) * 100);

  return new Promise((resolve, reject) => {
    const options = {
      key: activeKeyId,
      amount: amountInPaise,
      currency: 'INR',
      name: 'JMR SHOOZ DISTRIBUTION',
      description: `Wholesale Consignment Booking #${orderId}`,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80',
      prefill: {
        name: customerName || partyName,
        email: customerEmail,
        contact: customerPhone
      },
      notes: {
        orderId: orderId,
        partyName: partyName,
        merchant: 'JMR Shooz Footwear Hub'
      },
      theme: {
        color: '#C5A880', // JMR Brand Gold
        backdrop_color: 'rgba(11, 12, 16, 0.85)'
      },
      handler: function (response) {
        // Successful payment callback from Razorpay
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id || `rzp_ord_${Date.now()}`,
          signature: response.razorpay_signature || ''
        });
      },
      modal: {
        ondismiss: function () {
          // User closed checkout popup without completing payment
          resolve({
            success: false,
            dismissed: true,
            error: 'Payment was cancelled by the user.'
          });
        },
        escape: true,
        animation: true
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        resolve({
          success: false,
          error: response.error?.description || 'Payment transaction failed. Please retry with UPI or Card.'
        });
      });
      rzp.open();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates an official NPCI compliant UPI Deep Link URI
 * @param {Object} params
 * @param {string} params.upiId - Merchant VPA (e.g. jmrshooz@hdfcbank)
 * @param {string} params.payeeName - Registered payee business name
 * @param {number} params.amount - Total order amount
 * @param {string} params.orderId - Consignment / Order ID
 * @returns {string} - upi://pay?... URI
 */
export function generateUpiPaymentLink({
  upiId = 'jmrshooz@hdfcbank',
  payeeName = 'JMR SHOOZ DISTRIBUTION PVT LTD',
  amount = 0,
  orderId = ''
}) {
  const cleanUpi = upiId.trim();
  const cleanPayee = encodeURIComponent(payeeName.trim());
  const cleanNote = encodeURIComponent(`Wholesale Order ${orderId}`);
  const cleanAmount = Number(amount).toFixed(2);

  return `upi://pay?pa=${cleanUpi}&pn=${cleanPayee}&am=${cleanAmount}&cu=INR&tn=${cleanNote}&tr=${orderId}`;
}

/**
 * Returns dynamic high-res QR code image URL for instant UPI scanning
 * @param {string} upiUri
 * @param {number} size
 * @returns {string}
 */
export function getUpiQrCodeUrl(upiUri, size = 260) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=10&data=${encodeURIComponent(upiUri)}`;
}
