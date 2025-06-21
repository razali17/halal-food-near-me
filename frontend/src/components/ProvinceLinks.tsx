import React from "react";
import { Link } from "react-router-dom";
import { provinces } from "../data/provinces";

const ProvinceLinks: React.FC = () => {
    return (
        <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    Find Halal Food By Province
                </h2>

                <div className="flex flex-col gap-2 max-w-2xl mx-auto">
                    {provinces.map((province) => (
                        <Link
                            key={province.abbreviation}
                            to={`/canada/${province.slug}`}
                            className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-gray-700 hover:text-primary"
                        >
                            {province.name}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProvinceLinks;
