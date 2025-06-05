require("dotenv").config();
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");

async function importData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");

        // Read Excel file
        console.log("Reading Excel file...");
        const workbook = xlsx.readFile("../canadian-halal-restaurants.xlsx");
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        console.log("Excel data sample:", jsonData[0]);
        console.log("Number of rows:", jsonData.length);

        // Transform and import data
        console.log("Transforming data...");
        const validRestaurants = [];
        let skippedCount = 0;

        for (const row of jsonData) {
            // Skip entries without required fields
            if (!row.name || !row.full_address || !row.city || !row.state) {
                skippedCount++;
                console.warn(
                    `Skipping restaurant due to missing required fields:`,
                    row
                );
                continue;
            }

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

            validRestaurants.push({
                name: row.name,
                site: row.site || "",
                category: row.category || "restaurants",
                phone: row.phone || "",
                full_address: row.full_address,
                street: row.street || "",
                city: row.city,
                postal_code: row.postal_code || "",
                state: row.state,
                country: row.country || "Canada",
                reviews: parseInt(row.reviews) || 0,
                photo: row.photo || "",
                street_view: row.street_view || "",
                working_hours: workingHours,
                logo: row.logo || "",
                description: row.description || "",
                booking_appointment_link: row.booking_appointment_link || "",
            });
        }

        console.log(`Found ${validRestaurants.length} valid restaurants`);
        console.log(`Skipped ${skippedCount} invalid entries`);

        // Clear existing data
        await Restaurant.deleteMany({});
        console.log("Cleared existing restaurants");

        // Import new data in batches of 1000
        const batchSize = 1000;
        for (let i = 0; i < validRestaurants.length; i += batchSize) {
            const batch = validRestaurants.slice(i, i + batchSize);
            await Restaurant.insertMany(batch);
            console.log(
                `Imported restaurants ${i + 1} to ${Math.min(
                    i + batchSize,
                    validRestaurants.length
                )}`
            );
        }

        console.log(
            `Successfully imported ${validRestaurants.length} restaurants`
        );

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    } catch (error) {
        console.error("Error importing data:", error);
        if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
                console.error(
                    `Validation error for field '${key}':`,
                    error.errors[key].message
                );
            });
        }
        process.exit(1);
    }
}

importData();
