import { read, utils } from "xlsx";
import * as fs from "fs";
import * as path from "path";

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

// Read the Excel file
const workbook = read("canadian_halal_restaurants.xlsx", { type: "file" });
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = utils.sheet_to_json(worksheet) as ExcelRestaurantRow[];

// Transform the data
const restaurants = jsonData.map((row: ExcelRestaurantRow) => ({
    id: row.id?.toString() || Math.random().toString(36).substr(2, 9),
    name: row.name,
    address: row.address,
    city: row.city,
    state: "N/A",
    province: row.province,
    country: "Canada",
    zipCode: row.postalCode || row.zipCode || "N/A",
    phone: row.phone || "N/A",
    cuisineType: (row.cuisineType || "N/A")
        .split(",")
        .map((cuisine: string) => cuisine.trim())
        .filter((cuisine) => cuisine !== "N/A"),
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
}));

// Generate TypeScript file content
const tsContent = `// This file is auto-generated. Do not edit manually.
import { Restaurant } from "../types";

export const canadianRestaurants: Restaurant[] = ${JSON.stringify(
    restaurants,
    null,
    2
)};
`;

// Write the TypeScript file
fs.writeFileSync(
    path.join("src", "data", "generated-restaurants.ts"),
    tsContent
);

console.log(`Converted ${restaurants.length} restaurants to TypeScript.`);
