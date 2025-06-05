import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import { getCityBySlug } from '../data/cities';
import { getRestaurantsByCity, getRestaurantsByCityAndCuisine } from '../data/restaurants';
import { Restaurant } from '../types';

const CityDetail: React.FC = () => {
  const { stateSlug, citySlug } = useParams<{ stateSlug: string; citySlug: string }>();
  const [activeCuisine, setActiveCuisine] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  const city = getCityBySlug(citySlug || '');
  
  useEffect(() => {
    if (city) {
      if (activeCuisine === 'all') {
        setRestaurants(getRestaurantsByCity(city.name));
      } else {
        setRestaurants(getRestaurantsByCityAndCuisine(city.name, activeCuisine));
      }
    }
  }, [city, activeCuisine]);
  
  const handleCuisineChange = (cuisine: string) => {
    setActiveCuisine(cuisine);
  };
  
  if (!city) {
    return <div className="container mx-auto px-4 py-12 text-center">City not found</div>;
  }
  
  return (
    <div>
      <Breadcrumbs 
        customItems={[
          { name: city.state, path: `/state/${stateSlug}` },
          { name: city.name, path: `/state/${stateSlug}/${citySlug}` }
        ]} 
      />
      
      <section className="relative bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/7474203/pexels-photo-7474203.jpeg)',
            mixBlendMode: 'overlay'
          }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-start">
            <MapPin className="h-10 w-10 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Halal Food in {city.name}, {city.state}
              </h1>
              <p className="text-lg text-gray-100 max-w-3xl">
                {city.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <FilterBar activeCuisine={activeCuisine} onCuisineChange={handleCuisineChange} />
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {restaurants.length} {restaurants.length === 1 ? 'Restaurant' : 'Restaurants'} Found in {city.name}
            {activeCuisine !== 'all' && ` for ${activeCuisine.charAt(0).toUpperCase() + activeCuisine.slice(1)} Cuisine`}
          </h2>
          
          {restaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <ListingCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-600">
                We couldn't find any halal restaurants in {city.name} 
                {activeCuisine !== 'all' ? ` with ${activeCuisine} cuisine` : ''}.
                Try selecting a different cuisine filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CityDetail;