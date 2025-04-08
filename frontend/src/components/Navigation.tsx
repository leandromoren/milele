import React, { useState } from "react";
import { Menu, Search, SlidersHorizontal, Heart, ShoppingBag, UserCircle2 } from "lucide-react";

export default function Navigation() {
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center gap-4">
              <Menu className="h-6 w-6 cursor-pointer text-violet-600" />
              <h1 className="text-xl font-semibold text-violet-900">FIACA</h1>
            </div>
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl px-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-violet-400" />
                <input
                  type="text"
                  placeholder="Buscar ideas de moda..."
                  className="w-full py-2.5 pl-11 pr-4 bg-violet-50 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 hover:bg-violet-200 transition-colors text-violet-700"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="text-sm">Filtros</span>
              </button>
              <Heart className="h-5 w-5 cursor-pointer text-violet-600" />
              <ShoppingBag className="h-5 w-5 cursor-pointer text-violet-600" />
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white hover:bg-violet-700 transition-colors">
                <UserCircle2 className="h-5 w-5" />
                <span className="text-sm">Iniciar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
  );
}