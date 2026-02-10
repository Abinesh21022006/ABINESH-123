
import React, { useState, useMemo } from 'react';
import { Product, CartItem, Category } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import { ProductCard } from './components/ProductCard';
import { AIShoppingAssistant } from './components/AIShoppingAssistant';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tighter text-gray-900">LUMINA</h1>
            <div className="hidden md:flex gap-6 text-sm font-medium">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as Category)}
                  className={`${selectedCategory === cat ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="w-4 h-4 absolute left-3.5 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-indigo-600 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <img 
          src="https://picsum.photos/seed/hero/1920/1080" 
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105"
        />
        <div className="relative text-center space-y-6 px-4">
          <h2 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl">Elevate Your Everyday Essentials</h2>
          <p className="text-xl text-gray-300 max-w-xl mx-auto">Experience curated excellence with our minimalist, tech-integrated lifestyle collection.</p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors">Shop Collection</button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 font-bold rounded-full hover:bg-white/20 transition-colors">View Lookbook</button>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-bold mb-2">Editor's Choice</h3>
            <p className="text-gray-500">Hand-picked premium selections for your modern life.</p>
          </div>
          <div className="flex gap-2">
            <span className="text-sm font-medium text-gray-400">{filteredProducts.length} items found</span>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart}
                onViewDetails={setSelectedProduct}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <svg className="w-16 h-16 mx-auto text-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h4 className="text-xl font-semibold text-gray-900">No results found</h4>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* AI Assistant */}
      <AIShoppingAssistant products={PRODUCTS} />

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-2xl font-bold">Your Bag ({cartCount})</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <h4 className="text-lg font-bold">Your bag is empty</h4>
                    <p className="text-gray-500 mt-1">Start adding some premium essentials.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold"
                    >
                      Shop Now
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                        <div className="mt-4 flex justify-between items-end">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors">-</button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-white rounded-md transition-colors">+</button>
                          </div>
                          <p className="font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600 font-bold uppercase">Free</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-indigo-600">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-gray-200 hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-100">
                    Secure Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="w-full md:w-1/2 h-[400px] md:h-auto">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col">
                <div className="flex-1">
                  <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedProduct.category}</span>
                  <h2 className="text-4xl font-black text-gray-900 mt-4 leading-tight">{selectedProduct.name}</h2>
                  <p className="text-3xl font-light text-indigo-600 mt-2">${selectedProduct.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-2 mt-6 mb-8">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-400">{selectedProduct.reviews} Verified Customer Reviews</span>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="mt-12 space-y-4">
                  <button 
                    onClick={() => {addToCart(selectedProduct); setSelectedProduct(null); setIsCartOpen(true);}}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xl shadow-2xl shadow-gray-200 hover:bg-indigo-600 transition-all hover:-translate-y-1 active:translate-y-0"
                  >
                    Add to Bag — ${(selectedProduct.price).toFixed(2)}
                  </button>
                  <p className="text-center text-xs text-gray-400">Free 2-day shipping & luxury packaging included.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}