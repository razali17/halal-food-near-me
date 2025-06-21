import React from "react";
import { Link } from "react-router-dom";
import {
    Utensils,
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
} from "lucide-react";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-lg mb-2">
                            Halal Food Directory
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted resource for finding the best halal
                            food near you in the USA, UK, and Canada.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    to="/about"
                                    className="text-gray-400 hover:text-white"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/privacy"
                                    className="text-gray-400 hover:text-white"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition duration-300"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition duration-300"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-white transition duration-300"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="font-bold text-lg mb-2">Disclaimer</h3>
                        <p className="text-gray-400 text-sm">
                            Restaurant statuses can change. We try our best to
                            keep information up to date, but we recommend you
                            verify halal status directly with the restaurant
                            before visiting.
                        </p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500 text-sm">
                    <p>
                        &copy; {new Date().getFullYear()} Halal Food Near Me.
                        All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
