import { read, utils } from "xlsx";
import { Restaurant } from "../types";

interface ExcelRestaurantRow {
    id?: string | number;
    name: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    zipCode?: string;
    phone?: string;
    cuisineType?: string;
    rating?: string | number;
    reviewCount?: string | number;
    hours?: { [key: string]: string };
    website?: string;
    priceRange?: string;
    image?: string;
    dineIn?: boolean | number | string;
    takeOut?: boolean | number | string;
    prayerSpace?: boolean | number | string;
    servesAlcohol?: boolean | number | string;
    servesOnlyHalalMeat?: boolean | number | string;
    halalByHand?: boolean | number | string;
    halalCertification?: boolean | number | string;
    delivery?: boolean | number | string;
}

export const loadCanadianRestaurantsFromExcel = (
    filePath: string
): Restaurant[] => {
    try {
        // Read the Excel file
        console.log("Loading Excel file from:", filePath);
        const workbook = read(filePath, { type: "file" });
        console.log("Available sheets:", workbook.SheetNames);

        // Assume first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert sheet data to JSON
        const jsonData = utils.sheet_to_json(worksheet) as ExcelRestaurantRow[];
        console.log("Number of rows loaded:", jsonData.length);
        console.log("First row sample:", jsonData[0]);

        // Transform the data to match our Restaurant interface
        const restaurants = jsonData.map(
            (row: ExcelRestaurantRow): Restaurant => ({
                id:
                    row.id?.toString() ||
                    Math.random().toString(36).substr(2, 9),
                name: row.name,
                address: row.address,
                city: row.city,
                state: "N/A", // Empty for Canadian restaurants
                province: row.province,
                country: "Canada",
                zipCode: row.postalCode || row.zipCode || "N/A",
                phone: row.phone || "N/A",
                cuisineType: (row.cuisineType || "N/A")
                    .split(",")
                    .map((cuisine: string) => cuisine.trim())
                    .filter((cuisine) => cuisine !== "N/A"), // Remove N/A from cuisine array if it's the default
                rating: parseFloat(row.rating?.toString() || "0") || 0,
                reviewCount: parseInt(row.reviewCount?.toString() || "0") || 0,
                hours: row.hours || {
                    Monday: "N/A",
                    Tuesday: "N/A",
                    Wednesday: "N/A",
                    Thursday: "N/A",
                    Friday: "N/A",
                    Saturday: "N/A",
                    Sunday: "N/A",
                },
                website: row.website || "N/A",
                priceRange: row.priceRange || "N/A",
                image: row.image || "N/A",
                characteristics: {
                    dineIn: Boolean(row.dineIn),
                    takeOut: Boolean(row.takeOut),
                    prayerSpace: Boolean(row.prayerSpace),
                    servesAlcohol: Boolean(row.servesAlcohol),
                    servesOnlyHalalMeat: Boolean(row.servesOnlyHalalMeat),
                    halalByHand: Boolean(row.halalByHand),
                    halalCertification: Boolean(row.halalCertification),
                    delivery: Boolean(row.delivery),
                },
            })
        );

        console.log("Transformed restaurants:", restaurants.length);
        if (restaurants.length > 0) {
            console.log("Sample restaurant:", restaurants[0]);
        }

        return restaurants;
    } catch (error) {
        console.error("Error loading Canadian restaurants from Excel:", error);
        return [];
    }
};
