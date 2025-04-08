"use client"
import React, { useState, useMemo } from 'react';
import { Heart, X, Send, Bot, MessageSquare, Maximize2, Minimize2, Tag, BadgeCheck } from 'lucide-react';
import Navigation from '@/components/Navigation';

function App() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', text: string}>>([
    {
      type: 'ai',
      text: '¡Hola! Soy tu asistente de moda personal. Puedo ayudarte a elegir el outfit perfecto según el clima y la ocasión. ¿En qué puedo ayudarte hoy?'
    }
  ]);

  const [filters, setFilters] = useState({ 
    priceRange: [0, 1000],
    season: '',
    size: '',
    color: '',
    sortBy: '',
    showOnlyOnSale: false,
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const price = parseFloat(product.price.replace('€', ''));
        const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
        const matchesSeason = !filters.season || product.season === filters.season;
        const matchesSize = !filters.size || product.sizes.includes(filters.size);
        const matchesColor = !filters.color || product.colors.includes(filters.color);
        const matchesOnSale = !filters.showOnlyOnSale || product.onSale;
        return matchesPrice && matchesSeason && matchesSize && matchesColor && matchesOnSale;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price.replace('€', ''));
        const priceB = parseFloat(b.price.replace('€', ''));
        if (filters.sortBy === 'price-asc') return priceA - priceB;
        if (filters.sortBy === 'price-desc') return priceB - priceA;
        if (filters.sortBy === 'discount') {
          const discountA: any = a.onSale ? a.discount : 0;
          const discountB: any = b.onSale ? b.discount : 0;
          return discountB - discountA;
        }
        return 0;
      });
  }, [filters, products]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, { type: 'user', text: message }]);

    setTimeout(() => {
      const aiResponse = {
        type: 'ai' as const,
        text: 'Basado en el clima actual, te recomiendo usar ropa ligera y fresca. Podrías combinar una camiseta de algodón con unos jeans. También te sugiero llevar una chaqueta ligera por si refresca más tarde.'
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);

    setMessage('');
  };

  return (
    <div className="min-h-screen bg-violet-50">
      {/* Navigation */}
      <Navigation />

      {/* Filter Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-violet-900">Filtros</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-5 w-5 text-violet-600" />
            </button>
          </div>

          {/* Show Only Sale Items */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.showOnlyOnSale}
                onChange={(e) => setFilters({...filters, showOnlyOnSale: e.target.checked})}
                className="rounded text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm font-medium text-violet-900">Mostrar solo ofertas</span>
            </label>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-violet-900">Rango de Precio</h3>
            <div className="flex gap-4">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                className="w-full accent-violet-600"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                className="w-full accent-violet-600"
              />
            </div>
            <div className="flex justify-between text-sm text-violet-600">
              <span>€{filters.priceRange[0]}</span>
              <span>€{filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Season */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-violet-900">Temporada</h3>
            <select
              value={filters.season}
              onChange={(e) => setFilters({...filters, season: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">Todas</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-violet-900">Talle</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setFilters({...filters, size: filters.size === size ? '' : size})}
                  className={`p-2 text-sm border rounded-md ${
                    filters.size === size 
                      ? 'bg-violet-600 text-white border-violet-600' 
                      : 'hover:bg-violet-50 border-gray-200 text-violet-900'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-violet-900">Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setFilters({...filters, color: filters.color === color ? '' : color})}
                  className={`p-2 text-sm border rounded-md ${
                    filters.color === color 
                      ? 'bg-violet-600 text-white border-violet-600' 
                      : 'hover:bg-violet-50 border-gray-200 text-violet-900'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-violet-900">Ordenar por</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full p-2 border rounded-md focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="">Relevancia</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="discount">Mayor Descuento</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="pt-20 pb-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all text-sm font-medium text-violet-900 hover:bg-violet-600 hover:text-white border border-violet-100"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pinterest-style Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product.name}
              className="break-inside-avoid mb-4 relative group"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow">
                {/* Category Badge */}
                <div className="absolute left-3 top-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-violet-900 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {product.category}
                  </span>
                </div>
                
                {/* Sale Banner */}
                {product.onSale && (
                  <div className="absolute right-0 top-3 z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-rose-500 text-white px-4 py-1.5 rounded-l-lg shadow-lg flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span className="font-bold">-{product.discount}%</span>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <div className="bg-black/80 backdrop-blur-sm text-white px-4 py-1.5 rounded-l-lg">
                        <span className="line-through text-gray-400 text-sm">{product.originalPrice}</span>
                        <span className="font-bold ml-2">{product.price}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full object-cover"
                  />
                  
                  {/* Overlay on hover */}
                  <div className={`absolute inset-0 bg-black/40 flex flex-col justify-between p-4 transition-opacity duration-200 ${hoveredItem === index ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="flex justify-end">
                      <button className="bg-white p-2 rounded-full hover:bg-violet-50">
                        <Heart className="h-5 w-5 text-violet-600" />
                      </button>
                    </div>
                    <div>
                      <button className="w-full bg-violet-600 text-white py-3 rounded-lg hover:bg-violet-700">
                        Visitar tienda
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Information */}
                <div className="p-4 border-t border-gray-100">
                  <h3 className="font-medium text-violet-900">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm text-violet-600">{product.store}</span>
                    <BadgeCheck className="h-4 w-4 text-amber-400" />
                  </div>
                  {!product.onSale && (
                    <p className="font-medium text-sm text-violet-900 mt-1.5">{product.price}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.sizes.map(size => (
                      <span key={size} className="text-xs bg-violet-50 px-2 py-1 rounded text-violet-700">{size}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Button */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700 transition-colors z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {showChat && (
        <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-violet-600" />
              <h3 className="font-medium text-violet-900">Asistente de Moda</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 className="h-5 w-5 text-violet-600" /> : <Minimize2 className="h-5 w-5 text-violet-600" />}
              </button>
              <button onClick={() => setShowChat(false)}>
                <X className="h-5 w-5 text-violet-600" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="p-4 h-[380px] overflow-y-auto">
                {chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-violet-600 text-white rounded-br-none'
                          : 'bg-violet-50 text-violet-900 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregunta sobre el clima y la moda..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-200"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const categories = [
  'Todo',
  'Mujer',
  'Hombre',
  'Casual',
  'Formal',
  'Deportivo',
  'Accesorios',
  'Zapatos',
  'Ofertas'
];

const seasons = ['Primavera', 'Verano', 'Otoño', 'Invierno'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Amarillo', 'Rosa', 'Gris'];

const products = [
  {
    name: 'Vestido Floral',
    price: '€59.99',
    originalPrice: '€89.99',
    store: 'Zara',
    image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&q=80&w=1471',
    season: 'Primavera',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Rosa', 'Azul'],
    onSale: true,
    discount: 33,
    category: 'Mujer'
  },
  {
    name: 'Blazer Clásico',
    price: '€129.99',
    store: 'Massimo Dutti',
    image: 'https://images.unsplash.com/photo-1489345745021-740d36ed14a6?auto=format&fit=crop&q=80&w=1471',
    season: 'Otoño',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Gris'],
    onSale: false,
    category: 'Formal'
  },
  {
    name: 'Jeans Premium',
    price: '€49.99',
    originalPrice: '€79.99',
    store: 'Levi\'s',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1471',
    season: 'Todas',
    sizes: ['28', '30', '32', '34'],
    colors: ['Azul'],
    onSale: true,
    discount: 37,
    category: 'Casual'
  },
  {
    name: 'Bolso de Cuero',
    price: '€159.99',
    store: 'Mango',
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&q=80&w=1471',
    season: 'Todas',
    sizes: ['Único'],
    colors: ['Negro', 'Marrón'],
    onSale: false,
    category: 'Accesorios'
  },
  {
    name: 'Vestido de Noche',
    price: '€119.99',
    originalPrice: '€199.99',
    store: 'Sfera',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1471',
    season: 'Todas',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Negro', 'Rojo'],
    onSale: true,
    discount: 40,
    category: 'Formal'
  },
  {
    name: 'Chaqueta Bomber',
    price: '€89.99',
    store: 'Pull&Bear',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1471',
    season: 'Otoño',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Verde', 'Negro'],
    onSale: false,
    category: 'Casual'
  },
  {
    name: 'Zapatos Elegantes',
    price: '€89.99',
    originalPrice: '€149.99',
    store: 'Massimo Dutti',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=1471',
    season: 'Todas',
    sizes: ['38', '39', '40', '41', '42'],
    colors: ['Negro'],
    onSale: true,
    discount: 40,
    category: 'Zapatos'
  },
  {
    name: 'Bufanda de Lana',
    price: '€45.99',
    store: 'Uniqlo',
    image: 'https://images.unsplash.com/photo-1481454384333-quotation?auto=format&fit=crop&q=80&w=1471',
    season: 'Invierno',
    sizes: ['Único'],
    colors: ['Gris', 'Negro', 'Azul'],
    onSale: false,
    category: 'Accesorios'
  },
];

export default App;