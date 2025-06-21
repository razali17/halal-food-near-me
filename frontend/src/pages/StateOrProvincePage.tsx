import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, List, ArrowUpDown } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ListingCard from "../components/ListingCard";
import FilterBar from "../components/FilterBar";
import config from "../config";
import { Restaurant, Pagination } from "../types";
import FoodSpinner from "../components/FoodSpinner";

const StateOrProvincePage: React.FC = () => {
    const { country, stateorprovince } = useParams<{
        country: string;
        stateorprovince: string;
    }>();
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [cities, setCities] = useState<string[]>([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const [citiesError, setCitiesError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const navigate = useNavigate();

    const safeCountry = country || "";
    const safeState = stateorprovince || "";
    const stateNameFromSlug = (stateorprovince || "")
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    // Fetch cities in this state/province
    useEffect(() => {
        const fetchCities = async () => {
            setCitiesLoading(true);
            setCitiesError(null);
            try {
                const response = await fetch(
                    `${config.apiUrl}/api/cities?country=${encodeURIComponent(
                        safeCountry
                    )}&state=${encodeURIComponent(stateNameFromSlug)}`
                );
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

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!safeCountry || !safeState) return;

            try {
                setLoading(true);
                setError(null);
                const delay = new Promise((resolve) =>
                    setTimeout(resolve, 1000)
                );
                const params = new URLSearchParams({
                    country: safeCountry,
                    state: stateNameFromSlug,
                    page: currentPage.toString(),
                    sort: sortBy,
                    direction: sortDirection,
                });
                if (activeCuisine !== "all") {
                    params.append("cuisine", activeCuisine);
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
    }, [
        safeCountry,
        safeState,
        stateNameFromSlug,
        activeCuisine,
        currentPage,
        sortBy,
        sortDirection,
    ]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
        setCurrentPage(1); // Reset to first page when changing cuisine
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when changing page
    };

    // Handler for city dropdown
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const citySlug = e.target.value;
        if (citySlug) {
            navigate(`/${safeCountry}/${safeState}/${citySlug}`);
        }
    };

    const handleSortChange = (newSortBy: string) => {
        if (newSortBy === sortBy) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortBy(newSortBy);
            setSortDirection("asc");
        }
        setCurrentPage(1); // Reset to first page when changing sort
    };

    if (loading) {
        return <FoodSpinner message="Loading restaurants..." />;
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
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs
                        items={[
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
                        ]}
                    />

                    <div className="mt-6 flex items-center gap-4">
                        <MapPin className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold text-gray-900">
                            Halal Restaurants in {stateNameFromSlug}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
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
                                        No cities found in this region.
                                    </div>
                                ) : (
                                    <select
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        defaultValue=""
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
                        {/* Sort Options */}
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="h-5 w-5 text-gray-500" />
                                <span className="text-gray-700">Sort by:</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleSortChange("name")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        sortBy === "name"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Name{" "}
                                    {sortBy === "name" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </button>
                                <button
                                    onClick={() => handleSortChange("rating")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        sortBy === "rating"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Rating{" "}
                                    {sortBy === "rating" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </button>
                                <button
                                    onClick={() => handleSortChange("distance")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        sortBy === "distance"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Distance{" "}
                                    {sortBy === "distance" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
                                </button>
                                <button
                                    onClick={() => handleSortChange("random")}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        sortBy === "random"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Random
                                </button>
                            </div>
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

                            {restaurants.length > 0 ? (
                                <>
                                    <div className="space-y-6">
                                        {restaurants.map((restaurant) => (
                                            <ListingCard
                                                key={restaurant.id}
                                                restaurant={restaurant}
                                            />
                                        ))}
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
                                                        // Show current page, 2 pages before and 2 pages after
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
                                                            // Add ellipsis if there's a gap
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
                                        in {stateNameFromSlug}
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

export default StateOrProvincePage;
