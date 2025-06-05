export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  cuisineType: string[];
  rating: number;
  reviewCount: number;
  hours: {
    [key: string]: string;
  };
  website?: string;
  priceRange: string;
  image?: string;
  characteristics: {
    dineIn: boolean;
    takeOut: boolean;
    prayerSpace: boolean;
    servesAlcohol: boolean;
    servesOnlyHalalMeat: boolean;
    halalByHand: boolean;
    halalCertification: boolean;
    delivery: boolean;
  };
}

export interface State {
  name: string;
  abbreviation: string;
  slug: string;
}

export interface CuisineType {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface City {
  name: string;
  slug: string;
  state: string;
  description: string;
}