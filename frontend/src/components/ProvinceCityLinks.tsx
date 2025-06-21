import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Province } from "../types";
import config from "../config";

interface ProvinceCityLinksProps {
    province: Province;
}

const ProvinceCityLinks: React.FC<ProvinceCityLinksProps> = ({ province }) => {
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${config.apiUrl}/api/cities/${province.name}?country=Canada`
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
    }, [province.name]);

    const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const city = event.target.value;
        if (city) {
            navigate(
                `/canada/${province.slug}/${city
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center text-gray-600">Loading cities...</div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    if (cities.length === 0) {
        return (
            <div className="text-center text-gray-600">
                <p>No cities found in {province.name}.</p>
                <p>Check back soon for updates!</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <select
                onChange={handleCityChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue=""
            >
                <option value="" disabled>
                    Select a city
                </option>
                {cities.map((city) => (
                    <option key={city} value={city}>
                        {city}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ProvinceCityLinks;
