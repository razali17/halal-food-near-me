export interface Restaurant {
    id: string;
    name: string;
    site?: string;
    category?: string;
    phone?: string;
    full_address: string;
    street?: string;
    city: string;
    postal_code?: string;
    state: string;
    province: string;
    country: string;
    reviews?: number;
    photo?: string;
    street_view?: string;
    working_hours?: {
        [key: string]: string;
    };
    logo?: string;
    description?: string;
    booking_appointment_link?: string;
    location?: {
        type: string;
        coordinates: number[];
    };
    cuisine?: string;
    cuisineType: string[];
    createdAt?: string;
    updatedAt?: string;
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
}

export interface Province {
    name: string;
    slug: string;
    abbreviation: string;
    cities: City[];
}

export interface Pagination {
    total: number;
    page: number;
    pages: number;
    hasMore: boolean;
}

export interface PaginatedResponse<T> {
    restaurants: T[];
    pagination: Pagination;
}
