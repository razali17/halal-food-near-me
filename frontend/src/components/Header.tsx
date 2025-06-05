import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-white hover:text-emerald-100 transition duration-300">
          <Utensils className="h-7 w-7" />
          <span className="text-xl md:text-2xl font-bold">Halal Food Directory</span>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-emerald-100 transition duration-300">Home</Link>
          <Link to="/about" className="hover:text-emerald-100 transition duration-300">About</Link>
          <Link to="/contact" className="hover:text-emerald-100 transition duration-300">Contact</Link>
        </nav>
        
        <div className="md:hidden">
          <button className="p-2 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;