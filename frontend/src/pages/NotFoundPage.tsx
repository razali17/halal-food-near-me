import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-2xl font-light text-gray-600 mb-6">
                Oops! Page Not Found.
            </p>
            <p className="text-gray-500 mb-8">
                The page you are looking for does not exist. It might have been
                moved or deleted.
            </p>
            <Link
                to="/"
                className="inline-block bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
            >
                Go Back to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;
