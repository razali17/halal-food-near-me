import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, List, ArrowUpDown } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ListingCard from "../components/ListingCard";
import FilterBar from "../components/FilterBar";
import ProvinceCityLinks from "../components/ProvinceCityLinks";
import { provinces } from "../data/provinces";
import { Restaurant, Pagination } from "../types";
import config from "../config";

type SortOption = "name" | "rating" | "distance";

const ProvinceCity: React.FC = () => {
    const { provinceSlug, citySlug } = useParams<{
        provinceSlug: string;
        citySlug: string;
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

    const province = provinces.find((p) => p.slug === provinceSlug);

    // Convert slug back to city name format
    const cityNameFromSlug = citySlug
        ?.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!province || !cityNameFromSlug) return;

            try {
                setLoading(true);
                const response = await fetch(
                    `${config.apiUrl}/api/restaurants/location?city=${cityNameFromSlug}&state=${province.name}&page=${currentPage}&sort=${sortBy}&direction=${sortDirection}`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch restaurants");
                }
                const data = await response.json();
                setRestaurants(data.restaurants);
                setPagination(data.pagination);
                if (data.restaurants.length > 0) {
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
    }, [province, cityNameFromSlug, currentPage, sortBy, sortDirection]);

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
            // Toggle direction if clicking the same sort option
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Set new sort option and default to ascending
            setSortBy(newSortBy);
            setSortDirection("asc");
        }
        setCurrentPage(1); // Reset to first page when changing sort
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
                <p className="text-red-600 mb-4">{error}</p>
                <button
                    onClick={() => navigate(`/canada/${province.slug}`)}
                    className="text-primary hover:text-primary-dark underline"
                >
                    Back to {province.name}
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
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Canada", href: "/canada" },
                            {
                                label: province.name,
                                href: `/canada/${province.slug}`,
                            },
                            {
                                label: cityName,
                                href: `/canada/${province.slug}/${citySlug}`,
                            },
                        ]}
                    />

                    <div className="mt-6 flex items-center gap-4">
                        <MapPin className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold text-gray-900">
                            Halal Restaurants in {cityName}
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
                                <ProvinceCityLinks province={province} />
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
                                            ? "bg-primary text-white"
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
                                            ? "bg-primary text-white"
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
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Distance{" "}
                                    {sortBy === "distance" &&
                                        (sortDirection === "asc" ? "↑" : "↓")}
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

export default ProvinceCity;
