"use client"
import React, { useState, useMemo } from 'react';
import { Search, Menu, Heart, ShoppingBag, SlidersHorizontal, X, Send, Bot, MessageSquare, Maximize2, Minimize2, Tag } from 'lucide-react';

function HomePage() {
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
  });

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const price = parseFloat(product.price.replace('$', ''));
        const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
        const matchesSeason = !filters.season || product.season === filters.season;
        const matchesSize = !filters.size || product.sizes.includes(filters.size);
        const matchesColor = !filters.color || product.colors.includes(filters.color);
        return matchesPrice && matchesSeason && matchesSize && matchesColor;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price.replace('$', ''));
        const priceB = parseFloat(b.price.replace('$', ''));
        if (filters.sortBy === 'price-asc') return priceA - priceB;
        if (filters.sortBy === 'price-desc') return priceB - priceA;
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center gap-4">
              <Menu className="h-6 w-6 cursor-pointer" />
              <h1 className="text-xl text-gray-900 font-semibold">MILELE</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-900" />
                <input
                  type="text"
                  placeholder="Buscar ideas de moda..."
                  className="w-full py-2.5 pl-11 pr-4 bg-gray-100 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black/5"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-black hover:bg-gray-800 hover:cursor-pointer transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm text-white">Filtros</span>
              </button>
              <Heart className="h-5 w-5 cursor-pointer" />
              <ShoppingBag className="h-5 w-5 cursor-pointer" />
              <div className="h-8 w-8 rounded-full bg-gray-200 cursor-pointer" />
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Filtros</h2>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Rango de Precio</h3>
            <div className="flex gap-4">
              <input
                type="range"
                min="0"
                max="1000000"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({...filters, priceRange: [parseInt(e.target.value), filters.priceRange[1]]})}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)]})}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>€{filters.priceRange[0]}</span>
              <span>€{filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Season */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Temporada</h3>
            <select
              value={filters.season}
              onChange={(e) => setFilters({...filters, season: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todas</option>
              {seasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Talle</h3>
            <div className="grid grid-cols-4 gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setFilters({...filters, size: filters.size === size ? '' : size})}
                  className={`p-2 text-sm border rounded-md ${filters.size === size ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setFilters({...filters, color: filters.color === color ? '' : color})}
                  className={`p-2 text-sm border rounded-md ${filters.color === color ? 'bg-black text-black' : 'hover:bg-gray-100'}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Ordenar por</h3>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Relevancia</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="pt-20 pb-4 px-4">
        <div className="flex justify-center gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm"
            >
              {category}
            </button>
          ))}
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
              <div className="relative rounded-xl overflow-hidden">
                {product.onSale && (
                  <div className="absolute left-0 top-4 z-10">
                    <div className="bg-green-900 text-white px-4 py-1 rounded-r-lg shadow-lg flex items-center gap-2 animate-pulse">
                      <Tag className="h-4 w-4" />
                      <span className="font-semibold">-{product.discount}%</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="bg-gray-900 text-white px-4 py-1 rounded-r-lg">
                        <span className="line-through text-red-200">{product.originalPrice}</span>
                        <span className="font-bold ml-2">{product.price}</span>
                      </div>
                    </div>
                  </div>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full object-cover"
                />
                
                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/40 flex flex-col justify-between p-4 transition-opacity duration-200 ${hoveredItem === index ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="flex justify-end">
                    <button className="bg-white p-2 rounded-full hover:bg-gray-100">
                      <Heart className="h-5 w-5" />
                    </button>
                  </div>
                  <div>
                    <button className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-red-700">
                      Visitar tienda
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="font-medium text-sm">{product.price}</p>
                <p className="text-sm text-gray-600">{product.store}</p>
                <div className="flex items-center mt-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200" />
                  <p className="text-xs text-gray-500 ml-2">{product.store}</p>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.sizes.map(size => (
                    <span key={size} className="text-xs bg-gray-100 px-2 py-1 rounded">{size}</span>
                  ))}
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
          className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
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
              <Bot className="h-6 w-6 text-rose-500" />
              <h3 className="font-medium text-black">Asistente de Moda</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 className="h-5 w-5 text-black hover:cursor-pointer" /> : <Minimize2 className="h-5 w-5 text-black hover:cursor-pointer" />}
              </button>
              <button onClick={() => setShowChat(false)}>
                <X className="h-5 w-5 text-black hover:cursor-pointer" />
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
                          ? 'bg-black text-black rounded-br-none'
                          : 'bg-gray-100 text-black rounded-bl-none'
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
                    className="flex-1 p-2 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
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
      price: '$59999.99',
      originalPrice: '$79999.99',
      store: 'Zara',
      image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&q=80&w=1471',
      season: 'Primavera',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Rosa', 'Azul'],
      onSale: true,
      discount: 33
    },
    {
      name: 'Blazer Clásico',
      price: '$59999.99',
      store: 'Massimo Dutti',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&q=80&w=1471',
      season: 'Otoño',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Negro', 'Gris'],
      onSale: false
    },
    {
      name: 'Jeans Premium',
      price: '$59999.99',
      originalPrice: '$79999.99',
      store: 'Levi\'s',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=1471',
      season: 'Todas',
      sizes: ['28', '30', '32', '34'],
      colors: ['Azul'],
      onSale: true,
      discount: 37
    },
    {
      name: 'Bolso de Cuero',
      price: '$59999.99',
      store: 'Mango',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&q=80&w=1471',
      season: 'Todas',
      sizes: ['Único'],
      colors: ['Negro', 'Marrón'],
      onSale: false
    },
    {
      name: 'Vestido de Noche',
      price: '$59999.99',
      originalPrice: '$79999.99',
      store: 'Sfera',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=1471',
      season: 'Todas',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Negro', 'Rojo'],
      onSale: true,
      discount: 40
    },
    {
      name: 'Chaqueta Bomber',
      price: '$59999.99',
      store: 'Pull&Bear',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1471',
      season: 'Otoño',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Verde', 'Negro'],
      onSale: false
    },
    {
      name: 'Zapatos Elegantes',
      price: '$59999.99',
      originalPrice: '$79999.99',
      store: 'Massimo Dutti',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&q=80&w=1471',
      season: 'Todas',
      sizes: ['38', '39', '40', '41', '42'],
      colors: ['Negro'],
      onSale: true,
      discount: 40
    },
    {
      name: 'Bufanda de Lana',
      price: '$59999.99',
      store: 'Uniqlo',
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&q=80&w=1471',
      season: 'Invierno',
      sizes: ['Único'],
      colors: ['Gris', 'Negro', 'Azul'],
      onSale: false
    },
  ];

export default HomePage;