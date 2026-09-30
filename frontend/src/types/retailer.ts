export interface DeliveryAddress {
  street: string
  landmark?: string
  city: string
  state: string
  pincode: string
}

export interface RetailerProfile {
  id: string
  ownerName: string
  businessName: string
  phone: string
  email: string
  gstNumber?: string
  defaultAddress: DeliveryAddress
  registeredAt: string
}

export interface OrderSubmissionPayload {
  retailerId?: string
  dealerName: string
  storeName: string
  phone: string
  email: string
  notes?: string
  deliveryAddress: DeliveryAddress
  isAddressCustomized: boolean
  updateDefaultAddress?: boolean
}

const STORAGE_KEY = 'jmr_registered_retailer'

export function getStoredRetailer(): RetailerProfile | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null
    return JSON.parse(data) as RetailerProfile
  } catch (err) {
    console.error('Failed to read retailer profile from localStorage', err)
    return null
  }
}

export function saveStoredRetailer(retailer: RetailerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(retailer))
  } catch (err) {
    console.error('Failed to save retailer profile to localStorage', err)
  }
}

export function clearStoredRetailer(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.error('Failed to remove retailer profile from localStorage', err)
  }
}
