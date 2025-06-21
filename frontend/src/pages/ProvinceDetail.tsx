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
import { Restaurant, Pagination } from "../types";

const ProvinceDetail: React.FC = () => {
    const { provinceSlug } = useParams<{ provinceSlug: string }>();
    const [activeCuisine, setActiveCuisine] = useState("all");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    const province = provinces.find((p) => p.slug === provinceSlug);

    useEffect(() => {
        const fetchRestaurants = async () => {
            if (!province) return;

            try {
                setLoading(true);
                setError(null);

                const response =
                    activeCuisine === "all"
                        ? await getCanadianRestaurantsByProvince(
                              province.name,
                              currentPage
                          )
                        : await getCanadianRestaurantsByProvinceAndCuisine(
                              province.name,
                              activeCuisine,
                              currentPage
                          );

                setRestaurants(response.restaurants);
                setPagination(response.pagination);
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
    }, [province, activeCuisine, currentPage]);

    const handleCuisineChange = (cuisine: string) => {
        setActiveCuisine(cuisine);
        setCurrentPage(1); // Reset to first page when changing cuisine
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Scroll to top when changing page
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
                        ]}
                    />

                    <div className="mt-6 flex items-center gap-4">
                        <MapPin className="h-8 w-8 text-primary" />
                        <h1 className="text-4xl font-bold text-gray-900">
                            Halal Restaurants in {province.name}
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
                </div>
            </div>
        </div>
    );
};

export default ProvinceDetail;
