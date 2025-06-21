import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import config from "../config";
import FoodSpinner from "../components/FoodSpinner";
import { ALLOWED_COUNTRIES } from "../constants";
import NotFoundPage from "./NotFoundPage";
// import CuisineSection from "../components/CuisineSection";
// import { cuisines } from "../data/cuisines";

const CountryPage: React.FC = () => {
    const { country } = useParams<{ country: string }>();
    const [regions, setRegions] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const featuredCuisines = cuisines.slice(0, 3); // Uncomment if you want to show cuisines

    if (!country || !ALLOWED_COUNTRIES.includes(country.toLowerCase())) {
        return <NotFoundPage />;
    }

    const countryKey = (country || "").toLowerCase();
    const isUk = countryKey === "uk";

    const countryTitle =
        countryKey.charAt(0).toUpperCase() + countryKey.slice(1);

    const styles = {
        gradient:
            countryKey === "canada"
                ? "from-red-600 to-red-800"
                : countryKey === "usa"
                ? "from-blue-600 to-blue-800"
                : "from-green-600 to-green-800",
        iconBg:
            countryKey === "canada"
                ? "bg-red-500"
                : countryKey === "usa"
                ? "bg-blue-500"
                : "bg-green-500",
        text:
            countryKey === "canada"
                ? "text-red-700"
                : countryKey === "usa"
                ? "text-blue-700"
                : "text-green-700",
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!country) return;
            try {
                setLoading(true);
                setError(null);

                if (isUk) {
                    const response = await fetch(
                        `${config.apiUrl}/api/cities?country=UK`
                    );
                    if (!response.ok) throw new Error("Failed to fetch cities");
                    const data = await response.json();
                    setCities(data);
                } else {
                    const response = await fetch(
                        `${
                            config.apiUrl
                        }/api/regions?country=${encodeURIComponent(country)}`
                    );
                    if (!response.ok)
                        throw new Error("Failed to fetch regions");
                    const data = await response.json();
                    setRegions(data);
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [country, isUk]);

    if (loading) {
        return (
            <FoodSpinner
                message={isUk ? "Loading cities..." : "Loading regions..."}
            />
        );
    }

    if (error) {
        return <div className="text-red-600 text-center py-10">{error}</div>;
    }

    return (
        <div>
            <section
                className={`relative bg-gradient-to-r ${styles.gradient} text-white py-20 md:py-28`}
            >
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.pexels.com/photos/1144020/pexels-photo-1144020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
                        mixBlendMode: "overlay",
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <div
                            className={`inline-flex items-center justify-center p-3 ${styles.iconBg} bg-opacity-80 rounded-full mb-6`}
                        >
                            <UtensilsCrossed className="h-8 w-8" />
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Halal Food in {countryTitle}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-100 mb-8">
                            Discover authentic halal restaurants across{" "}
                            {countryTitle}'s regions. Find certified halal
                            restaurants that cater to your dietary needs.
                        </p>

                        <a
                            href="#regions"
                            className="bg-white text-emerald-700 hover:bg-gray-100 py-3 px-6 rounded-full font-medium shadow-md transition duration-300"
                        >
                            Browse by Region
                        </a>
                    </div>
                </div>
            </section>

            <section id="regions" className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {isUk
                                ? "Find Halal Restaurants by City"
                                : "Find Halal Restaurants by Region"}
                        </h2>
                        <p className="text-gray-600 max-w-3xl mx-auto">
                            Explore halal dining options across {countryTitle}.
                        </p>
                    </div>
                    {loading ? (
                        <FoodSpinner
                            message={
                                isUk
                                    ? "Loading cities..."
                                    : "Loading regions..."
                            }
                        />
                    ) : error ? (
                        <div className="text-red-600 text-center">{error}</div>
                    ) : isUk ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {cities.map((city) => (
                                <Link
                                    key={city}
                                    to={`/${country}/city/${city
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                    className={`block p-6 bg-white rounded-lg shadow hover:shadow-md transition text-lg font-medium ${styles.text} hover:text-emerald-600 text-center border border-gray-100`}
                                >
                                    {city}
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {regions.map((region) => (
                                <Link
                                    key={region}
                                    to={`/${country}/${region
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                    className={`block p-6 bg-white rounded-lg shadow hover:shadow-md transition text-lg font-medium ${styles.text} hover:text-emerald-600 text-center border border-gray-100`}
                                >
                                    {region}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default CountryPage;
