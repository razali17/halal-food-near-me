import { Restaurant, PaginatedResponse } from "../types";
import config from "../config";

// Function to fetch restaurants from the API
async function fetchRestaurants(
    params: Record<string, string | number>
): Promise<PaginatedResponse<Restaurant>> {
    const queryString = new URLSearchParams();

    // Convert all params to strings and add to query string
    Object.entries(params).forEach(([key, value]) => {
        queryString.append(key, String(value));
    });

    const response = await fetch(
        `${config.apiUrl}/api/restaurants?${queryString.toString()}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
    }
    return response.json();
}

export async function getCanadianRestaurantsByProvince(
    province: string,
    page: number = 1
): Promise<PaginatedResponse<Restaurant>> {
    return fetchRestaurants({ state: province, country: "Canada", page });
}

export async function getCanadianRestaurantsByCity(
    city: string,
    page: number = 1
): Promise<PaginatedResponse<Restaurant>> {
    return fetchRestaurants({ city, country: "Canada", page });
}

export async function getCanadianRestaurantsByCuisine(
    cuisine: string,
    page: number = 1
): Promise<PaginatedResponse<Restaurant>> {
    return fetchRestaurants({ cuisine, country: "Canada", page });
}

export async function getCanadianRestaurantsByProvinceAndCuisine(
    province: string,
    cuisine: string,
    page: number = 1
): Promise<PaginatedResponse<Restaurant>> {
    return fetchRestaurants({
        state: province,
        cuisine,
        country: "Canada",
        page,
    });
}

export async function getCanadianRestaurantsByCityAndCuisine(
    city: string,
    cuisine: string,
    page: number = 1
): Promise<PaginatedResponse<Restaurant>> {
    return fetchRestaurants({ city, cuisine, country: "Canada", page });
}
