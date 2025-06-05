require("dotenv").config();
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const path = require("path");

async function importUKData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Read the Excel file
        const filePath = path.join(__dirname, "../../uk-restaurants.xlsx");
        console.log("Reading file from:", filePath);
        const workbook = xlsx.readFile(filePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Transform and clean the data
        const restaurants = data.map((row) => {
            // Parse working hours if it's a string
            let workingHours = row.working_hours;
            if (typeof workingHours === "string") {
                try {
                    workingHours = JSON.parse(workingHours);
                } catch (e) {
                    console.warn(
                        `Failed to parse working hours for ${row.name}, using default hours`
                    );
                    workingHours = {
                        Sunday: "Closed",
                        Monday: "Closed",
                        Tuesday: "Closed",
                        Wednesday: "Closed",
                        Thursday: "Closed",
                        Friday: "Closed",
                        Saturday: "Closed",
                    };
                }
            }

            return {
                name: row.name || "Unknown",
                address: row.address || "Unknown",
                city: row.city || "Unknown",
                state: row.county || row.region || "Unknown", // Using county/region as state for UK
                province: row.county || row.region || "Unknown", // Using county/region as province for UK
                postal_code: row.postal_code || "",
                phone: row.phone || "",
                website: row.website || "",
                cuisine: row.cuisine || "",
                price_range: row.price_range || "",
                rating: row.rating || "",
                photo: row.photo || "",
                street_view: row.street_view || "",
                logo: row.logo || "",
                country: "UK",
                category: "restaurants",
                reviews: parseInt(row.reviews) || 0,
                description: row.description || "",
                booking_appointment_link: row.booking_appointment_link || "",
                working_hours: workingHours,
            };
        });

        // First, remove any existing UK restaurants
        console.log("Removing existing UK restaurants...");
        await Restaurant.deleteMany({ country: "UK" });

        // Insert the new data
        console.log(`Importing ${restaurants.length} restaurants...`);
        await Restaurant.insertMany(restaurants);
        console.log("Import completed successfully");
    } catch (error) {
        console.error("Error importing data:", error);
    } finally {
        await mongoose.disconnect();
    }
}

importUKData();
