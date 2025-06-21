import React from "react";
import { Link } from "react-router-dom";
import { Frown } from "lucide-react";

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex min-h-full flex-col bg-white pt-32 pb-12">
            <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
                <div className="flex flex-shrink-0 justify-center">
                    <Frown className="h-24 w-24 text-emerald-600" />
                </div>
                <div className="text-center py-20">
                    <h1 className="text-6xl font-bold text-gray-800 mb-4">
                        404
                    </h1>
                    <p className="text-2xl font-light text-gray-600 mb-6">
                        Oops! Page Not Found.
                    </p>
                    <p className="text-gray-500 mb-8">
                        The page you are looking for does not exist. It might
                        have been moved or deleted.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-emerald-600 hover:bg-emerald-800 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Go Back to Homepage
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default NotFoundPage;
