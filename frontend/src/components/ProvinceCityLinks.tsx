import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ProvinceCityLinksProps {
    province: string;
    provinceSlug: string;
}

const ProvinceCityLinks: React.FC<ProvinceCityLinksProps> = ({
    province,
    provinceSlug,
}) => {
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5001/api/cities/${province}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch cities");
                }
                const data = await response.json();
                setCities(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, [province]);

    return (
        <section className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
                    Cities in {province}
                </h2>

                {loading ? (
                    <div className="text-center text-gray-600">
                        <p>Loading cities...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                    </div>
                ) : cities.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
                        {cities.map((city) => (
                            <Link
                                key={city.toLowerCase().replace(/\s+/g, "-")}
                                to={`/province/${provinceSlug}/${city
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                className="block text-gray-700 hover:text-emerald-600 hover:underline transition duration-300"
                            >
                                {city}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600">
                        <p>No cities found in {province}.</p>
                        <p>Check back soon for updates!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProvinceCityLinks;
