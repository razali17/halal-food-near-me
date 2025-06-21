import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ListingCard from "../components/ListingCard";
import FilterBar from "../components/FilterBar";
import { getStateBySlug } from "../data/states";
import { Restaurant } from "../types";

const CityDetail: React.FC = () => {
    const { stateSlug, citySlug } = useParams<{
        stateSlug: string;
        citySlug: string;
    }>();
    const navigate = useNavigate();
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cityName, setCityName] = useState<string>("");

    const state = getStateBySlug(stateSlug || "");

    // Convert slug back to city name format
    const cityNameFromSlug = citySlug
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!state || !cityNameFromSlug) return;

            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:5001/api/restaurants/location?city=${cityNameFromSlug}&state=${state.name}&country=USA`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                const data = await response.json();
                setRestaurants(data);
                if (data.length > 0) {
                    setCityName(cityNameFromSlug);
                } else {
                    // If no restaurants found, city might not exist
                    setError("No restaurants found in this city");
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, [state, cityNameFromSlug]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
    };

    if (!state) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                State not found
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
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate(`/usa/${stateSlug}`)}
                    className="text-emerald-600 hover:text-emerald-700 underline"
                >
                    Back to {state.name}
                </button>
            </div>
        );
    }

    // Filter restaurants by cuisine if needed
    const filteredRestaurants =
        activeCuisine === "all"
            ? restaurants
            : restaurants.filter(
                  (restaurant) =>
                      restaurant.cuisine?.toLowerCase() ===
                      activeCuisine.toLowerCase()
              );

    return (
        <div>
            <Breadcrumbs
                items={[
                    { label: state.name, href: `/usa/${stateSlug}` },
                    { label: cityName, href: `/usa/${stateSlug}/${citySlug}` },
                ]}
            />

            <section className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12">
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.pexels.com/photos/7474203/pexels-photo-7474203.jpeg)",
                        mixBlendMode: "overlay",
                    }}
                ></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-start">
                        <MapPin className="h-10 w-10 mr-4 mt-1 flex-shrink-0" />
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                Halal Food in {cityName}, {state.name}
                            </h1>
                            <p className="text-lg text-gray-100 max-w-3xl">
                                Discover the best halal restaurants in{" "}
                                {cityName}. From local favorites to hidden gems,
                                find the perfect halal dining spot that suits
                                your taste.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-4 py-12">
                <FilterBar
                    activeCuisine={activeCuisine}
                    onCuisineChange={handleCuisineChange}
                />

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        {filteredRestaurants.length}{" "}
                        {filteredRestaurants.length === 1
                            ? "Restaurant"
                            : "Restaurants"}{" "}
                        Found in {cityName}
                        {activeCuisine !== "all" &&
                            ` for ${
                                activeCuisine.charAt(0).toUpperCase() +
                                activeCuisine.slice(1)
                            } Cuisine`}
                    </h2>

                    {filteredRestaurants.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRestaurants.map((restaurant) => (
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
                                We couldn't find any halal restaurants in{" "}
                                {cityName}
                                {activeCuisine !== "all"
                                    ? ` with ${activeCuisine} cuisine`
                                    : ""}
                                . Try selecting a different cuisine filter.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">
                        About Halal Food in {cityName}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {cityName} offers a diverse selection of halal dining
                        options for both locals and visitors. From traditional
                        favorites to modern fusion cuisine, you'll find
                        restaurants that cater to various tastes while adhering
                        to Islamic dietary guidelines.
                    </p>
                    <p className="text-gray-600">
                        Our directory helps you discover the best halal
                        restaurants in {cityName}, with detailed information
                        about each establishment, including their specialties,
                        prayer facilities, and halal certification status.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CityDetail;
