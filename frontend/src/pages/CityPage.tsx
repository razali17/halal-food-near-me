import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, List, ArrowUpDown } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ListingCard from "../components/ListingCard";
import FilterBar from "../components/FilterBar";
import config from "../config";
import { Restaurant, Pagination } from "../types";
import FoodSpinner from "../components/FoodSpinner";
import SortControls from "../components/SortControls";
import DisclaimerBanner from "../components/DisclaimerBanner";

type SortOption = "name" | "rating" | "distance" | "random";

const CityPage: React.FC = () => {
    const { country, stateorprovince, city } = useParams<{
        country: string;
        stateorprovince: string;
        city: string;
    }>();
    const navigate = useNavigate();
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cityName, setCityName] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [cities, setCities] = useState<string[]>([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [citiesError, setCitiesError] = useState<string | null>(null);

    const safeCountry = country || "";
    const safeState = stateorprovince || "";
    const safeCity = city || "";
    const cityNameFromSlug = (city || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    const stateNameFromSlug = (stateorprovince || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!safeCountry || !cityNameFromSlug) return;

            try {
                setLoading(true);
                const delay = new Promise((resolve) =>
                    setTimeout(resolve, 1000)
                );
                const params = new URLSearchParams({
                    country: safeCountry,
                    city: cityNameFromSlug,
                    page: currentPage.toString(),
                    sort: sortBy,
                    direction: sortDirection,
                });
                if (activeCuisine !== "all") {
                    params.append("cuisine", activeCuisine);
                }
                // For UK, do not include state
                if (safeCountry.toLowerCase() !== "uk") {
                    params.append("state", stateNameFromSlug);
                }
                const response = await fetch(
                    `${
                        config.apiUrl
                    }/api/restaurants/location?${params.toString()}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                const data = await response.json();
                await delay;
                setRestaurants(data.restaurants);
                setPagination(data.pagination);
                if (data.restaurants.length > 0) {
                    setCityName(cityNameFromSlug);
                } else {
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
    }, [
        safeCountry,
        safeState,
        cityNameFromSlug,
        currentPage,
        sortBy,
        sortDirection,
        activeCuisine,
    ]);

    // Fetch cities for dropdown
    useEffect(() => {
        const fetchCities = async () => {
            setCitiesLoading(true);
            setCitiesError(null);
            try {
                let url = "";
                if (safeCountry.toLowerCase() === "uk") {
                    url = `${config.apiUrl}/api/cities?country=UK`;
                } else {
                    url = `${
                        config.apiUrl
                    }/api/cities?country=${encodeURIComponent(
                        safeCountry
                    )}&state=${encodeURIComponent(stateNameFromSlug)}`;
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch cities");
                const data = await response.json();
                setCities(data);
            } catch (err) {
                setCitiesError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setCitiesLoading(false);
            }
        };
        fetchCities();
    }, [safeCountry, stateNameFromSlug]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
        setCurrentPage(1); // Reset to first page when changing cuisine
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when changing page
    };

    const handleSortChange = (newSortBy: SortOption) => {
        if (newSortBy === sortBy) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(newSortBy);
            setSortDirection("asc");
        }
        setCurrentPage(1); // Reset to first page when changing sort
    };

    // Handler for city dropdown
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const citySlug = e.target.value;
        if (citySlug) {
            if (safeCountry.toLowerCase() === "uk") {
                navigate(`/uk/city/${citySlug}`);
            } else {
                navigate(`/${safeCountry}/${safeState}/${citySlug}`);
            }
        }
    };

    if (loading) {
        return (
            <div className="pt-20">
                <FoodSpinner message="Loading restaurants..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12 text-center pt-28">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate(`/${safeCountry}/${safeState}`)}
                    className="text-primary hover:text-primary-dark underline"
                >
                    Back to {stateNameFromSlug}
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
        <div className="bg-gray-50 min-h-screen pt-20">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs
                    items={
                        safeCountry.toLowerCase() === "uk"
                            ? [
                                  { label: "Home", href: "/" },
                                  {
                                      label: "United Kingdom",
                                      href: "/uk",
                                  },
                                  {
                                      label: cityName,
                                      href: `/uk/city/${safeCity}`,
                                  },
                              ]
                            : [
                                  { label: "Home", href: "/" },
                                  {
                                      label:
                                          safeCountry.charAt(0).toUpperCase() +
                                          safeCountry.slice(1),
                                      href: `/${safeCountry}`,
                                  },
                                  {
                                      label: stateNameFromSlug,
                                      href: `/${safeCountry}/${safeState}`,
                                  },
                                  {
                                      label: cityName,
                                      href: `/${safeCountry}/${safeState}/${safeCity}`,
                                  },
                              ]
                    }
                />
            </div>

            <div className="container mx-auto px-4">
                <DisclaimerBanner />

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        {cityName} Halal Restaurants
                    </h1>
                    <SortControls
                        sort={sortBy}
                        setSort={setSortBy}
                        direction={sortDirection}
                        setDirection={setSortDirection}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <List className="h-5 w-5 text-primary" />
                                    <h2 className="text-xl font-semibold">
                                        Browse by City
                                    </h2>
                                </div>
                                {citiesLoading ? (
                                    <FoodSpinner message="Loading cities..." />
                                ) : citiesError ? (
                                    <div className="text-red-600">
                                        {citiesError}
                                    </div>
                                ) : cities.length === 0 ? (
                                    <div className="text-gray-600">
                                        No cities found.
                                    </div>
                                ) : (
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        defaultValue={safeCity}
                                        onChange={handleCityChange}
                                    >
                                        <option value="" disabled>
                                            Select a city
                                        </option>
                                        {cities.map((city) => (
                                            <option
                                                key={city}
                                                value={city
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")}
                                            >
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="mb-8">
                            <FilterBar
                                activeCuisine={activeCuisine}
                                onCuisineChange={handleCuisineChange}
                            />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">
                                {pagination?.total || 0}{" "}
                                {pagination?.total === 1
                                    ? "Restaurant"
                                    : "Restaurants"}{" "}
                                Found
                                {activeCuisine !== "all" &&
                                    ` for ${
                                        activeCuisine.charAt(0).toUpperCase() +
                                        activeCuisine.slice(1)
                                    } Cuisine`}
                            </h2>
                            {filteredRestaurants.length > 0 ? (
                                <>
                                    <div className="space-y-6">
                                        {filteredRestaurants.map(
                                            (restaurant) => (
                                                <ListingCard
                                                    key={restaurant.id}
                                                    restaurant={restaurant}
                                                />
                                            )
                                        )}
                                    </div>
                                    {/* Pagination */}
                                    {pagination && pagination.pages > 1 && (
                                        <div className="mt-8 flex justify-center">
                                            <div className="flex gap-2 items-center">
                                                {/* First page button */}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(1)
                                                    }
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-2 rounded ${
                                                        currentPage === 1
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    &laquo;
                                                </button>
                                                {/* Previous page button */}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage - 1
                                                        )
                                                    }
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-2 rounded ${
                                                        currentPage === 1
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    &lsaquo;
                                                </button>
                                                {/* Page numbers */}
                                                {Array.from(
                                                    {
                                                        length: pagination.pages,
                                                    },
                                                    (_, i) => i + 1
                                                )
                                                    .filter((page) => {
                                                        const range = 2;
                                                        return (
                                                            page === 1 ||
                                                            page ===
                                                                pagination.pages ||
                                                            (page >=
                                                                currentPage -
                                                                    range &&
                                                                page <=
                                                                    currentPage +
                                                                        range)
                                                        );
                                                    })
                                                    .map(
                                                        (
                                                            page,
                                                            index,
                                                            array
                                                        ) => {
                                                            const showEllipsisBefore =
                                                                index > 0 &&
                                                                array[
                                                                    index - 1
                                                                ] !==
                                                                    page - 1;
                                                            const showEllipsisAfter =
                                                                index <
                                                                    array.length -
                                                                        1 &&
                                                                array[
                                                                    index + 1
                                                                ] !==
                                                                    page + 1;
                                                            return (
                                                                <React.Fragment
                                                                    key={page}
                                                                >
                                                                    {showEllipsisBefore && (
                                                                        <span className="px-2 text-gray-500">
                                                                            ...
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        onClick={() =>
                                                                            handlePageChange(
                                                                                page
                                                                            )
                                                                        }
                                                                        className={`px-4 py-2 rounded ${
                                                                            page ===
                                                                            currentPage
                                                                                ? "bg-primary text-black font-bold ring-2 ring-black ring-offset-2"
                                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                        }`}
                                                                    >
                                                                        {page}
                                                                    </button>
                                                                    {showEllipsisAfter && (
                                                                        <span className="px-2 text-gray-500">
                                                                            ...
                                                                        </span>
                                                                    )}
                                                                </React.Fragment>
                                                            );
                                                        }
                                                    )}
                                                {/* Next page button */}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            currentPage + 1
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        pagination.pages
                                                    }
                                                    className={`px-3 py-2 rounded ${
                                                        currentPage ===
                                                        pagination.pages
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    &rsaquo;
                                                </button>
                                                {/* Last page button */}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pagination.pages
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        pagination.pages
                                                    }
                                                    className={`px-3 py-2 rounded ${
                                                        currentPage ===
                                                        pagination.pages
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    &raquo;
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-lg text-center">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                                        No restaurants found
                                    </h3>
                                    <p className="text-gray-600">
                                        We couldn't find any halal restaurants
                                        in {cityName}
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
                </div>
            </div>
        </div>
    );
};

export default CityPage;
