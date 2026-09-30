import { useState } from 'react'
import { Navbar, type NavTab } from './components/Navbar'
import { Footer } from './components/Footer'
import { HomeView } from './views/HomeView'
import { BrandsView } from './views/BrandsView'
import { ProductsView } from './views/ProductsView'
import { AboutView } from './views/AboutView'
import { ManagementView } from './views/ManagementView'
import { ContactView } from './views/ContactView'
import { ProductModal } from './components/ProductModal'
import { BrandModal } from './components/BrandModal'
import { EnquiryDrawer, type EnquiryItem } from './components/EnquiryDrawer'
import { Toast, type ToastMessage } from './components/Toast'
import type { Product } from './data/productsData'
import type { Brand } from './data/brandsData'

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [isEnquiryDrawerOpen, setIsEnquiryDrawerOpen] = useState(false)
  const [enquiryItems, setEnquiryItems] = useState<EnquiryItem[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Context passing for Contact view pre-fills
  const [contactSubject, setContactSubject] = useState<string>('')
  const [contactBrand, setContactBrand] = useState<string>('')
  const [productBrandFilter, setProductBrandFilter] = useState<string>('All')

  // Add product to wholesale quote list
  const handleAddToEnquiry = (product: Product, cartons = 3) => {
    setEnquiryItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, cartons: item.cartons + cartons }
            : item
        )
      } else {
        return [...prev, { product, cartons }]
      }
    })

    setToast({
      id: Date.now().toString(),
      title: 'Added to Wholesale Enquiry',
      description: `${product.name} (${cartons} cartons / ${cartons * product.cartonPairs} pairs) added to your quote list.`,
      type: 'success'
    })
  }

  // Update cartons in enquiry list
  const handleUpdateCartons = (productId: string, cartons: number) => {
    setEnquiryItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, cartons } : item
      )
    )
  }

  // Remove item from enquiry list
  const handleRemoveItem = (productId: string) => {
    setEnquiryItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  // Clear all items
  const handleClearAllEnquiry = () => {
    setEnquiryItems([])
  }

  // Direct enquire for a single product from modal
  const handleDirectEnquireProduct = (product: Product) => {
    setContactSubject(`Wholesale Dealership Quote for ${product.name} (SKU: ${product.sku})`)
    setContactBrand(product.brandName)
    setActiveTab('contact')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Apply for dealership from a brand card / modal
  const handleApplyForBrandDealership = (brand: Brand) => {
    setContactSubject(`Territory Dealership Application for ${brand.name}`)
    setContactBrand(brand.name)
    setActiveTab('contact')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Filter products by a brand when clicking "View Shoes" on brand card
  const handleSelectBrandForProducts = (brandId: string) => {
    setProductBrandFilter(brandId)
    setActiveTab('products')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEnquirySubmissionSuccess = (refId: string) => {
    setToast({
      id: Date.now().toString(),
      title: 'Quote Request Dispatched!',
      description: `Reference #${refId}. Our distribution desk will contact you with wholesale pricing sheets within 2 hours.`,
      type: 'success'
    })
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        enquiryCount={enquiryItems.length}
        onOpenEnquiryDrawer={() => setIsEnquiryDrawerOpen(true)}
      />

      {/* Main Views Container */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            onSelectTab={setActiveTab}
            onOpenProductModal={(p) => setSelectedProduct(p)}
            onOpenBrandModal={(b) => setSelectedBrand(b)}
            onAddToEnquiry={handleAddToEnquiry}
          />
        )}

        {activeTab === 'brands' && (
          <BrandsView
            onSelectTab={setActiveTab}
            onOpenBrandModal={(b) => setSelectedBrand(b)}
            onSelectBrandForProducts={handleSelectBrandForProducts}
            onApplyForBrandDealership={handleApplyForBrandDealership}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            initialBrandFilter={productBrandFilter}
            onOpenProductModal={(p) => setSelectedProduct(p)}
            onAddToEnquiry={handleAddToEnquiry}
            onOpenEnquiryDrawer={() => setIsEnquiryDrawerOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutView onSelectTab={setActiveTab} />
        )}

        {activeTab === 'management' && (
          <ManagementView onSelectTab={setActiveTab} />
        )}

        {activeTab === 'contact' && (
          <ContactView
            initialSubject={contactSubject}
            initialBrand={contactBrand}
            onSubmissionSuccess={handleEnquirySubmissionSuccess}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setActiveTab} />

      {/* Interactive Overlays */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToEnquiry={handleAddToEnquiry}
        onDirectEnquire={handleDirectEnquireProduct}
      />

      <BrandModal
        brand={selectedBrand}
        onClose={() => setSelectedBrand(null)}
        onApplyDealership={handleApplyForBrandDealership}
        onViewBrandCatalog={(brand) => handleSelectBrandForProducts(brand.id)}
      />

      <EnquiryDrawer
        isOpen={isEnquiryDrawerOpen}
        onClose={() => setIsEnquiryDrawerOpen(false)}
        items={enquiryItems}
        onUpdateCartons={handleUpdateCartons}
        onRemoveItem={handleRemoveItem}
        onClearAll={handleClearAllEnquiry}
        onSubmitSuccess={handleEnquirySubmissionSuccess}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
