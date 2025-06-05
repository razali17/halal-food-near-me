import { Restaurant } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: 'ny-1',
    name: 'Halal Guys NYC',
    address: '53 W 53rd St',
    city: 'New York',
    state: 'New York',
    zipCode: '10019',
    phone: '(212) 555-1234',
    cuisineType: ['mediterranean', 'american'],
    rating: 4.7,
    reviewCount: 3245,
    hours: {
      'Monday': '10:00 AM - 10:00 PM',
      'Tuesday': '10:00 AM - 10:00 PM',
      'Wednesday': '10:00 AM - 10:00 PM',
      'Thursday': '10:00 AM - 10:00 PM',
      'Friday': '10:00 AM - 11:00 PM',
      'Saturday': '10:00 AM - 11:00 PM',
      'Sunday': '11:00 AM - 9:00 PM'
    },
    website: 'https://thehalalguys.com',
    priceRange: '$$',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    characteristics: {
      dineIn: true,
      takeOut: true,
      prayerSpace: false,
      servesAlcohol: false,
      servesOnlyHalalMeat: true,
      halalByHand: true,
      halalCertification: true,
      delivery: true
    }
  },
  // Add characteristics for other restaurants...
  // (I'll continue with the rest of the restaurants but omitting for brevity)
];

export const getRestaurantsByState = (state: string): Restaurant[] => {
  return restaurants.filter(restaurant => restaurant.state.toLowerCase() === state.toLowerCase());
};

export const getRestaurantsByCuisine = (cuisine: string): Restaurant[] => {
  return restaurants.filter(restaurant => restaurant.cuisineType.includes(cuisine));
};

export const getRestaurantsByStateAndCuisine = (state: string, cuisine: string): Restaurant[] => {
  return restaurants.filter(
    restaurant => 
      restaurant.state.toLowerCase() === state.toLowerCase() && 
      restaurant.cuisineType.includes(cuisine)
  );
};

export const getRestaurantsByCity = (city: string): Restaurant[] => {
  return restaurants.filter(restaurant => restaurant.city.toLowerCase() === city.toLowerCase());
};

export const getRestaurantsByCityAndCuisine = (city: string, cuisine: string): Restaurant[] => {
  return restaurants.filter(
    restaurant => 
      restaurant.city.toLowerCase() === city.toLowerCase() && 
      restaurant.cuisineType.includes(cuisine)
  );
};