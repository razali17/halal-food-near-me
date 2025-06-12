import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MapPin, List } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ListingCard from "../components/ListingCard";
import FilterBar from "../components/FilterBar";
import ProvinceLinks from "../components/ProvinceLinks";
import ProvinceCityLinks from "../components/ProvinceCityLinks";
import { provinces } from "../data/provinces";
import {
    getCanadianRestaurantsByProvince,
    getCanadianRestaurantsByProvinceAndCuisine,
} from "../data/canadian_restaurants";
import { Restaurant } from "../types";

const ProvinceDetail: React.FC = () => {
    const { provinceSlug } = useParams<{ provinceSlug: string }>();
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const province = provinces.find((p) => p.slug === provinceSlug);

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!province) return;

            try {
                setLoading(true);
                setError(null);

                if (activeCuisine === "all") {
                    const data = await getCanadianRestaurantsByProvince(
                        province.name
                    );
                    setRestaurants(data);
                } else {
                    const data =
                        await getCanadianRestaurantsByProvinceAndCuisine(
                            province.name,
                            activeCuisine
                        );
                    setRestaurants(data);
                }
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch restaurants"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [province, activeCuisine]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
    };

    if (!province) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                Province not found
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                Loading restaurants...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div>
            <Breadcrumbs
                customItems={[
                    { name: "Canada", path: "/canada" },
                    { name: province.name, path: "" },
                ]}
            />

            <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.pexels.com/photos/1144020/pexels-photo-1144020.jpeg)",
                        mixBlendMode: "overlay",
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-start">
                        <MapPin className="h-10 w-10 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Halal Food in {province.name}
                            </h1>
                            <p className="text-lg text-gray-100 max-w-3xl">
                                Discover the best halal restaurants in{" "}
                                {province.name}. Browse by city or cuisine type
                                to find your next favorite dining spot.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="mb-8">
                            <FilterBar
                                activeCuisine={activeCuisine}
                                onCuisineChange={handleCuisineChange}
                            />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                {restaurants.length}{" "}
                                {restaurants.length === 1
                                    ? "Restaurant"
                                    : "Restaurants"}{" "}
                                Found
                                {activeCuisine !== "all" &&
                                    ` for ${
                                        activeCuisine.charAt(0).toUpperCase() +
                                        activeCuisine.slice(1)
                                    } Cuisine`}
                            </h2>

                            {restaurants.length > 0 ? (
                                <div className="space-y-6">
                                    {restaurants.map((restaurant) => (
                                        <ListingCard
                                            key={restaurant.id}
                                            restaurant={restaurant}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-lg text-center">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                                        No restaurants found
                                    </h3>
                                    <p className="text-gray-600">
                                        We couldn't find any halal restaurants
                                        in {province.name}
                                        {activeCuisine !== "all"
                                            ? ` with ${activeCuisine} cuisine`
                                            : ""}
                                        . Try selecting a different cuisine
                                        filter.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 p-6 rounded-lg mb-8">
                            <div className="flex items-center mb-4">
                                <List className="h-5 w-5 mr-2 text-emerald-600" />
                                <h3 className="text-lg font-semibold">
                                    Cities in {province.name}
                                </h3>
                            </div>
                            <ProvinceCityLinks
                                province={province.name}
                                provinceSlug={province.slug}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProvinceDetail;
