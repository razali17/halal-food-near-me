import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Utensils, ChevronDown, X } from "lucide-react";

const Header: React.FC = () => {
    const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCountriesOpen, setIsMobileCountriesOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const countries = [
        { name: "USA", link: "/usa" },
        { name: "Canada", link: "/canada" },
        { name: "United Kingdom", link: "/uk" },
    ];

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileCountriesOpen(false);
    };

    // Handle scroll events to show/hide header
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header when scrolling up or at the top
            if (currentScrollY < lastScrollY || currentScrollY < 100) {
                setIsVisible(true);
            }
            // Hide header when scrolling down (but not at the very top)
            else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    return (
        <header
            className={`bg-gradient-to-r from-emerald-600 to-emerald-800 text-white shadow-md fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
                isVisible
                    ? "transform translate-y-0"
                    : "transform -translate-y-full"
            }`}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link
                    to="/"
                    className="flex items-center space-x-2 text-white hover:text-emerald-100 transition duration-300"
                >
                    <Utensils className="h-7 w-7" />
                    <span className="text-xl md:text-2xl font-bold">
                        Halal Food Directory
                    </span>
                </Link>

                <nav className="hidden md:flex space-x-6 items-center">
                    <Link
                        to="/"
                        className="hover:text-emerald-100 transition duration-300"
                    >
                        Home
                    </Link>

                    {/* Country Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setIsCountryDropdownOpen(!isCountryDropdownOpen)
                            }
                            className="flex items-center space-x-1 hover:text-emerald-100 transition duration-300 focus:outline-none"
                        >
                            <span>Countries</span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    isCountryDropdownOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {isCountryDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 duration-200">
                                {countries.map((country) => (
                                    <Link
                                        key={country.name}
                                        to={country.link}
                                        className="block px-4 py-3 text-gray-800 hover:bg-emerald-50 hover:text-emerald-600 transition duration-200"
                                        onClick={() =>
                                            setIsCountryDropdownOpen(false)
                                        }
                                    >
                                        {country.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/about"
                        className="hover:text-emerald-100 transition duration-300"
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="hover:text-emerald-100 transition duration-300"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 focus:outline-none text-white hover:text-emerald-100 transition duration-300"
                    >
                        {isMobileMenuOpen ? (
                            <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 transition-transform duration-200"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden absolute top-full left-0 right-0 bg-emerald-50 shadow-lg border-t border-emerald-200 z-50 transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                        ? "opacity-100 transform translate-y-0"
                        : "opacity-0 transform -translate-y-4 pointer-events-none"
                }`}
            >
                <div className="px-4 py-6 space-y-4">
                    <Link
                        to="/"
                        className="block text-gray-800 hover:text-emerald-600 font-medium transition duration-200 py-2 px-3 rounded-lg hover:bg-emerald-100"
                        onClick={closeMobileMenu}
                    >
                        Home
                    </Link>

                    {/* Mobile Country Section */}
                    <div>
                        <button
                            onClick={() =>
                                setIsMobileCountriesOpen(!isMobileCountriesOpen)
                            }
                            className="flex items-center justify-between w-full text-gray-800 hover:text-emerald-600 font-medium transition duration-200 py-2 px-3 rounded-lg hover:bg-emerald-100"
                        >
                            <span>Countries</span>
                            <ChevronDown
                                className={`h-4 w-4 transition-transform duration-200 ${
                                    isMobileCountriesOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                        <div
                            className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
                                isMobileCountriesOpen
                                    ? "max-h-48 opacity-100"
                                    : "max-h-0 opacity-0"
                            }`}
                        >
                            {countries.map((country, index) => (
                                <Link
                                    key={country.name}
                                    to={country.link}
                                    className={`block py-2 px-4 rounded-lg text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition duration-200 text-sm transform transition-all ${
                                        isMobileCountriesOpen
                                            ? "translate-x-0 opacity-100"
                                            : "translate-x-4 opacity-0"
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                    onClick={closeMobileMenu}
                                >
                                    {country.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <Link
                        to="/about"
                        className="block text-gray-800 hover:text-emerald-600 font-medium transition duration-200 py-2 px-3 rounded-lg hover:bg-emerald-100"
                        onClick={closeMobileMenu}
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="block text-gray-800 hover:text-emerald-600 font-medium transition duration-200 py-2 px-3 rounded-lg hover:bg-emerald-100"
                        onClick={closeMobileMenu}
                    >
                        Contact
                    </Link>
                </div>
            </div>

            {/* Close dropdown when clicking outside */}
            {isCountryDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCountryDropdownOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;
