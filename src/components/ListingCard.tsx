import React from 'react';
import { MapPin, Clock, Phone, Star, ExternalLink, Check, X } from 'lucide-react';
import { Restaurant } from '../types';
import { formatPhoneNumber, getStarRating, formatReviewCount } from '../utils/helpers';

interface ListingCardProps {
  restaurant: Restaurant;
}

const ListingCard: React.FC<ListingCardProps> = ({ restaurant }) => {
  const starIcons = getStarRating(restaurant.rating);
  const defaultImage = 'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg';
  
  const characteristics = [
    { label: 'Dine in', value: restaurant.characteristics.dineIn },
    { label: 'Take out', value: restaurant.characteristics.takeOut },
    { label: 'Prayer space', value: restaurant.characteristics.prayerSpace },
    { label: 'Serves alcohol', value: restaurant.characteristics.servesAlcohol },
    { label: 'Serves only halal meat', value: restaurant.characteristics.servesOnlyHalalMeat },
    { label: 'Halal by hand', value: restaurant.characteristics.halalByHand },
    { label: 'Halal certification', value: restaurant.characteristics.halalCertification },
    { label: 'Delivery', value: restaurant.characteristics.delivery }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300 w-full">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 lg:w-1/4">
          <div className="relative h-64 md:h-full">
            <img
              src={restaurant.image || defaultImage}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
              {restaurant.priceRange}
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
              
              <div className="flex items-center mb-3">
                {starIcons.map((type, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 mr-1 ${
                      type === 'full' ? 'text-yellow-400 fill-current' : 
                      type === 'half' ? 'text-yellow-400' : 
                      'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-1">
                  {restaurant.rating} ({formatReviewCount(restaurant.reviewCount)} reviews)
                </span>
              </div>

              <div className="flex items-start space-x-1 mb-2">
                <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600">
                  {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zipCode}
                </div>
              </div>

              <div className="flex items-start space-x-1 mb-2">
                <Phone className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div className="text-gray-600">{formatPhoneNumber(restaurant.phone)}</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {restaurant.cuisineType.map(cuisine => (
                  <span 
                    key={cuisine}
                    className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm capitalize"
                  >
                    {cuisine}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {characteristics.map(({ label, value }) => (
                  <div key={label} className="flex items-center space-x-2">
                    {value ? (
                      <Check className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                ))}
              </div>

              {restaurant.website && (
                <a 
                  href={restaurant.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-800 text-sm font-medium"
                >
                  Visit website
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              )}
            </div>

            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="flex items-start space-x-1">
                <Clock className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-gray-600 mb-1">Hours:</div>
                  <div className="grid grid-cols-1 gap-y-1 text-sm">
                    {Object.entries(restaurant.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between gap-x-4">
                        <span className="font-medium min-w-[100px]">{day}:</span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;