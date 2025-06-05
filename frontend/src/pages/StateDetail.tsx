import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, List } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import StateLinks from '../components/StateLinks';
import CityLinks from '../components/CityLinks';
import { getStateBySlug } from '../data/states';
import { getRestaurantsByState, getRestaurantsByStateAndCuisine } from '../data/restaurants';
import { Restaurant } from '../types';

const StateDetail: React.FC = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const [activeCuisine, setActiveCuisine] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  
  const state = getStateBySlug(stateSlug || '');
  
  useEffect(() => {
    if (state) {
      if (activeCuisine === 'all') {
        setRestaurants(getRestaurantsByState(state.name));
      } else {
        setRestaurants(getRestaurantsByStateAndCuisine(state.name, activeCuisine));
      }
    }
  }, [state, activeCuisine]);
  
  const handleCuisineChange = (cuisine: string) => {
    setActiveCuisine(cuisine);
  };
  
  if (!state) {
    return <div className="container mx-auto px-4 py-12 text-center">State not found</div>;
  }
  
  return (
    <div>
      <Breadcrumbs state={state.name} />
      
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
                Halal Food in {state.name}
              </h1>
              <p className="text-lg text-gray-100 max-w-3xl">
                Discover the best halal restaurants in {state.name}. 
                From authentic halal Mexican, Chinese, and Indian cuisines to Mediterranean, 
                American, and fusion dishes - all prepared according to Islamic dietary laws.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <List className="h-6 w-6 text-emerald-600 mr-2" />
            <h2 className="text-xl font-semibold">Quick Navigation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="#cities" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-emerald-600">Browse by City</h3>
              <p className="text-sm text-gray-600">Find halal restaurants in specific cities</p>
            </a>
            <a href="#restaurants" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-emerald-600">Available Restaurants</h3>
              <p className="text-sm text-gray-600">Browse {restaurants.length} halal restaurants in {state.name}</p>
            </a>
            <a href="#cuisine-filter" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-emerald-600">Filter by Cuisine</h3>
              <p className="text-sm text-gray-600">Find restaurants by your preferred cuisine type</p>
            </a>
            <a href="#about" className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-emerald-600">About Halal Food in {state.name}</h3>
              <p className="text-sm text-gray-600">Learn about the local halal food scene</p>
            </a>
          </div>
        </div>
      </div>

      <section id="cities">
        <CityLinks state={state.name} stateSlug={state.slug} />
      </section>
      
      <section className="container mx-auto px-4 py-12">
        <div id="cuisine-filter">
          <FilterBar activeCuisine={activeCuisine} onCuisineChange={handleCuisineChange} />
        </div>
        
        <div id="restaurants" className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {restaurants.length} {restaurants.length === 1 ? 'Restaurant' : 'Restaurants'} Found
            {activeCuisine !== 'all' && ` for ${activeCuisine.charAt(0).toUpperCase() + activeCuisine.slice(1)} Cuisine`}
          </h2>
          
          {restaurants.length > 0 ? (
            <div className="space-y-6">
              {restaurants.map(restaurant => (
                <ListingCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No restaurants found</h3>
              <p className="text-gray-600">
                We couldn't find any halal restaurants in {state.name} 
                {activeCuisine !== 'all' ? ` with ${activeCuisine} cuisine` : ''}.
                Try selecting a different cuisine filter.
              </p>
            </div>
          )}
        </div>
        
        <div id="about" className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            About Halal Food in {state.name}
          </h2>
          <p className="text-gray-600 mb-4">
            {state.name} offers a diverse range of halal dining options that cater to various tastes and preferences.
            Whether you're looking for traditional halal cuisine or international dishes prepared according to Islamic dietary laws,
            you'll find plenty of choices throughout the state.
          </p>
          <p className="text-gray-600 mb-4">
            Many restaurants in {state.name} now offer halal options, making it easier for Muslims to enjoy various cuisines
            while adhering to their dietary requirements. From family-owned establishments to modern fusion restaurants,
            the halal food scene in {state.name} continues to grow and evolve.
          </p>
          <p className="text-gray-600">
            Our directory helps you discover these hidden gems, with detailed information about each restaurant,
            including addresses, hours, cuisine types, and customer ratings to help you find the perfect dining spot.
          </p>
        </div>
      </section>
      
      <section id="other-states">
        <StateLinks />
      </section>
    </div>
  );
};

export default StateDetail;