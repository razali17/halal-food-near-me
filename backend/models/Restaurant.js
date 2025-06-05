const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        province: {
            type: String,
            required: true,
            trim: true,
        },
        postal_code: String,
        country: {
            type: String,
            required: true,
            trim: true,
            default: "Canada",
        },
        phone: String,
        website: String,
        cuisine: String,
        price_range: String,
        rating: String,
        photo: String,
        street_view: String,
        logo: String,
        site: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            trim: true,
            default: "restaurants",
        },
        reviews: {
            type: Number,
            default: 0,
        },
        street: {
            type: String,
            trim: true,
        },
        working_hours: {
            type: Map,
            of: String,
            default: {
                Sunday: "Closed",
                Monday: "Closed",
                Tuesday: "Closed",
                Wednesday: "Closed",
                Thursday: "Closed",
                Friday: "Closed",
                Saturday: "Closed",
            },
        },
        description: {
            type: String,
            trim: true,
        },
        booking_appointment_link: {
            type: String,
            trim: true,
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                default: [0, 0],
            },
        },
    },
    {
        timestamps: true,
    }
);

// Create indexes
restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ city: 1, state: 1 });
restaurantSchema.index({ name: "text", description: "text" });

// Create text index for search functionality
restaurantSchema.index({
    name: "text",
    cuisine: "text",
    city: "text",
    state: "text",
    province: "text",
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
