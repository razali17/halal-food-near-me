import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Utensils className="h-6 w-6" />
              <span className="text-xl font-bold">Halal Food Directory</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your comprehensive guide to halal food across the United States. Discover halal restaurants offering a variety of cuisines in every state.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition duration-300">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition duration-300">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition duration-300">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cuisines</h3>
            <ul className="space-y-2">
              <li><Link to="/cuisine/mexican" className="text-gray-400 hover:text-white transition duration-300">Halal Mexican</Link></li>
              <li><Link to="/cuisine/chinese" className="text-gray-400 hover:text-white transition duration-300">Halal Chinese</Link></li>
              <li><Link to="/cuisine/indian" className="text-gray-400 hover:text-white transition duration-300">Halal Indian</Link></li>
              <li><Link to="/cuisine/mediterranean" className="text-gray-400 hover:text-white transition duration-300">Halal Mediterranean</Link></li>
              <li><Link to="/cuisine/american" className="text-gray-400 hover:text-white transition duration-300">Halal American</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 mt-1 text-emerald-500" />
                <span className="text-gray-400">info@halalfooddirectory.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 mt-1 text-emerald-500" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Halal Food Directory. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;