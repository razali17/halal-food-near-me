import { Restaurant } from "../types";
import { loadCanadianRestaurantsFromExcel } from "../utils/excel-loader";

console.log("Starting to load Canadian restaurants from Excel...");

// Load restaurants from Excel file
export const canadianRestaurants: Restaurant[] =
    loadCanadianRestaurantsFromExcel(
        "/Users/razali/projects/halal-food-near-me/canadian_halal_restaurants.xlsx"
    );

console.log("Initial Canadian restaurants array:", canadianRestaurants);
console.log("Total Canadian restaurants loaded:", canadianRestaurants.length);

export const getCanadianRestaurantsByProvince = (
    province: string
): Restaurant[] => {
    console.log("Filtering restaurants for province:", province);
    console.log("Available provinces:", [
        ...new Set(canadianRestaurants.map((r) => r.province)),
    ]);

    const filtered = canadianRestaurants.filter((restaurant) => {
        const restaurantProvince =
            restaurant.province?.toLowerCase().trim() || "";
        const searchProvince = province.toLowerCase().trim();
        const matches = restaurantProvince === searchProvince;
        console.log(
            `Comparing '${restaurantProvince}' with '${searchProvince}': ${matches}`
        );
        return matches;
    });

    console.log("Found restaurants for province:", filtered.length);
    return filtered;
};

export const getCanadianRestaurantsByCity = (city: string): Restaurant[] => {
    console.log("Filtering restaurants for city:", city);
    console.log("Available cities:", [
        ...new Set(canadianRestaurants.map((r) => r.city)),
    ]);

    const filtered = canadianRestaurants.filter((restaurant) => {
        const restaurantCity = restaurant.city.toLowerCase().trim();
        const searchCity = city.toLowerCase().trim();
        const matches = restaurantCity === searchCity;
        console.log(
            `Comparing '${restaurantCity}' with '${searchCity}': ${matches}`
        );
        return matches;
    });

    console.log("Found restaurants for city:", filtered.length);
    return filtered;
};

export const getCanadianRestaurantsByCuisine = (
    cuisine: string
): Restaurant[] => {
    console.log("Filtering restaurants for cuisine:", cuisine);
    const filtered = canadianRestaurants.filter((restaurant) =>
        restaurant.cuisineType.some(
            (type) => type.toLowerCase().trim() === cuisine.toLowerCase().trim()
        )
    );
    console.log("Found restaurants for cuisine:", filtered.length);
    return filtered;
};

export const getCanadianRestaurantsByProvinceAndCuisine = (
    province: string,
    cuisine: string
): Restaurant[] => {
    console.log(
        "Filtering restaurants for province and cuisine:",
        province,
        cuisine
    );
    const filtered = canadianRestaurants.filter(
        (restaurant) =>
            restaurant.province?.toLowerCase().trim() ===
                province.toLowerCase().trim() &&
            restaurant.cuisineType.some(
                (type) =>
                    type.toLowerCase().trim() === cuisine.toLowerCase().trim()
            )
    );
    console.log("Found restaurants for province and cuisine:", filtered.length);
    return filtered;
};

export const getCanadianRestaurantsByCityAndCuisine = (
    city: string,
    cuisine: string
): Restaurant[] => {
    console.log("Filtering restaurants for city and cuisine:", city, cuisine);
    const filtered = canadianRestaurants.filter(
        (restaurant) =>
            restaurant.city.toLowerCase().trim() ===
                city.toLowerCase().trim() &&
            restaurant.cuisineType.some(
                (type) =>
                    type.toLowerCase().trim() === cuisine.toLowerCase().trim()
            )
    );
    console.log("Found restaurants for city and cuisine:", filtered.length);
    return filtered;
};
