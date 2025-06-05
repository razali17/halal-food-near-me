import React from "react";
import {
    MapPin,
    Clock,
    Phone,
    Star,
    ExternalLink,
    Info,
    Calendar,
    Image,
} from "lucide-react";
import { Restaurant } from "../types";
import { formatPhoneNumber } from "../utils/helpers";

interface ListingCardProps {
    restaurant: Restaurant;
}

const ListingCard: React.FC<ListingCardProps> = ({ restaurant }) => {
    const defaultImage =
        "https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg";

    // Get the main image to display
    const mainImage = restaurant.photo || defaultImage;

    // Debug log
    console.log("Restaurant data:", restaurant);
    console.log("Selected image URL:", mainImage);

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 w-full">
            <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="md:w-1/3 lg:w-1/4">
                    <div
                        style={{
                            backgroundImage: `url("https://lh3.googleusercontent.com/gps-cs-s/AC9...w800-h500-k-no")`,
                            backgroundSize: "cover",
                            width: "400px",
                            height: "250px",
                        }}
                    />
                    <div className="relative h-64 md:h-full">
                        <img
                            crossOrigin="anonymous"
                            src={mainImage}
                            alt={restaurant.name}
                            className="w-full h-full object-cover"
                        />
                        {restaurant.street_view && (
                            <div className="absolute bottom-4 right-4">
                                <a
                                    href={restaurant.street_view}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50"
                                >
                                    Street View
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6">
                    <div className="flex flex-col space-y-4">
                        {/* Header */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                {restaurant.name}
                            </h3>
                            <div className="flex items-center mb-2">
                                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                                <span className="text-sm text-gray-600">
                                    {restaurant.reviews || 0} reviews
                                </span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2">
                            <div className="flex items-start space-x-2">
                                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="text-gray-600">
                                    {restaurant.full_address ||
                                        restaurant.street}
                                    <br />
                                    {restaurant.city}, {restaurant.state}{" "}
                                    {restaurant.postal_code}
                                    <br />
                                    {restaurant.country}
                                </div>
                            </div>

                            {restaurant.phone && (
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-600">
                                        {formatPhoneNumber(restaurant.phone)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Category and Description */}
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Info className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                <span className="text-gray-600 capitalize">
                                    {restaurant.category}
                                </span>
                            </div>

                            {restaurant.description && (
                                <p className="text-gray-600 text-sm">
                                    {restaurant.description}
                                </p>
                            )}
                        </div>

                        {/* Working Hours */}
                        {restaurant.working_hours &&
                            Object.keys(restaurant.working_hours).length >
                                0 && (
                                <div className="flex items-start space-x-2">
                                    <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <div className="text-gray-600 font-medium mb-1">
                                            Hours:
                                        </div>
                                        <div className="grid grid-cols-1 gap-y-1">
                                            {Object.entries(
                                                restaurant.working_hours
                                            ).map(([day, hours]) => (
                                                <div
                                                    key={day}
                                                    className="flex justify-between gap-x-4"
                                                >
                                                    <span className="text-gray-600 min-w-[100px]">
                                                        {day}:
                                                    </span>
                                                    <span className="text-gray-600">
                                                        {hours}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        {/* Links */}
                        <div className="flex flex-wrap gap-3">
                            {restaurant.site && (
                                <a
                                    href={restaurant.site}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                >
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Website
                                </a>
                            )}

                            {restaurant.booking_appointment_link && (
                                <a
                                    href={restaurant.booking_appointment_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Book Appointment
                                </a>
                            )}

                            {restaurant.logo && (
                                <a
                                    href={restaurant.logo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                                >
                                    <Image className="h-4 w-4 mr-1" />
                                    View Logo
                                </a>
                            )}
                        </div>

                        {/* Timestamps */}
                        <div className="text-xs text-gray-400 mt-4">
                            {restaurant.createdAt && (
                                <div>
                                    Added:{" "}
                                    {new Date(
                                        restaurant.createdAt
                                    ).toLocaleDateString()}
                                </div>
                            )}
                            {restaurant.updatedAt && (
                                <div>
                                    Last updated:{" "}
                                    {new Date(
                                        restaurant.updatedAt
                                    ).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
