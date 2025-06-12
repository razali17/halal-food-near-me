import { Restaurant } from "../types";
import config from "../config";

// Function to fetch restaurants from the API
async function fetchRestaurants(params: Record<string, string>) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
        `${config.apiUrl}/api/restaurants?${queryString}`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
    }
    return response.json();
}

export async function getCanadianRestaurantsByProvince(
    province: string
): Promise<Restaurant[]> {
    return fetchRestaurants({ state: province, country: "Canada" });
}

export async function getCanadianRestaurantsByCity(
    city: string
): Promise<Restaurant[]> {
    return fetchRestaurants({ city, country: "Canada" });
}

export async function getCanadianRestaurantsByCuisine(
    cuisine: string
): Promise<Restaurant[]> {
    return fetchRestaurants({ cuisine, country: "Canada" });
}

export async function getCanadianRestaurantsByProvinceAndCuisine(
    province: string,
    cuisine: string
): Promise<Restaurant[]> {
    return fetchRestaurants({ state: province, cuisine, country: "Canada" });
}

export async function getCanadianRestaurantsByCityAndCuisine(
    city: string,
    cuisine: string
): Promise<Restaurant[]> {
    return fetchRestaurants({ city, cuisine, country: "Canada" });
}
