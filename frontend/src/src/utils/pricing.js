/**
 * Universal MRP Pricing Utility
 * User Rule: "sirf mrp dikhe discount n dikhe or mrp se he bill calculate ho"
 * Only MRP is displayed, discounts are removed, and all wholesale bills are calculated strictly using MRP.
 */

export function getProductMrp(product) {
  if (!product) return 1499;

  // Direct number
  if (typeof product.mrp === 'number' && product.mrp > 0) {
    return product.mrp;
  }

  // From suggestedRetailPrice (e.g. "₹1,499 / pair" or "₹1,499")
  if (product.suggestedRetailPrice) {
    const parsed = parseInt(String(product.suggestedRetailPrice).replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // From retailPrice
  if (product.retailPrice) {
    const parsed = parseInt(String(product.retailPrice).replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }

  // From wholesaleRate fallback
  if (typeof product.wholesaleRate === 'number' && product.wholesaleRate > 0) {
    return Math.round(product.wholesaleRate * 1.8);
  }
  if (typeof product.wholesaleRate === 'string') {
    const parsed = parseInt(product.wholesaleRate.replace(/\D/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) return Math.round(parsed * 1.8);
  }

  return 1499;
}

export function calculateSetRates(product, setsCount = 1) {
  const mrpPerPair = getProductMrp(product);
  const pairsPerSet = parseInt(product?.pairsPerSet, 10) || 12;
  const ratePerSet = pairsPerSet * mrpPerPair;
  const sets = Math.max(1, parseInt(setsCount, 10) || 1);
  const totalPairs = sets * pairsPerSet;
  const totalSubtotal = sets * ratePerSet;

  return {
    mrpPerPair,
    ratePerPair: mrpPerPair,
    pairsPerSet,
    ratePerSet,
    sets,
    totalPairs,
    subtotal: totalSubtotal
  };
}
