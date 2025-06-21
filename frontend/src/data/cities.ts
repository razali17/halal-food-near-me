import { City } from "../types";

export const cities: City[] = [
    {
        name: "New York City",
        slug: "new-york-city",
        state: "New York",
        description:
            "Discover halal restaurants in the vibrant food scene of NYC, from food carts to fine dining establishments.",
    },
    {
        name: "Los Angeles",
        slug: "los-angeles",
        state: "California",
        description:
            "Explore LA's diverse halal food options, featuring cuisines from around the world.",
    },
    {
        name: "San Francisco",
        slug: "san-francisco",
        state: "California",
        description:
            "Find authentic halal restaurants in the Bay Area's culinary hub.",
    },
    {
        name: "Long Beach",
        slug: "long-beach",
        state: "California",
        description:
            "Discover halal dining options in this coastal Southern California city.",
    },
    {
        name: "Chicago",
        slug: "chicago",
        state: "Illinois",
        description:
            "Experience Chicago's renowned food scene with these halal restaurants.",
    },
    {
        name: "Houston",
        slug: "houston",
        state: "Texas",
        description:
            "Explore Houston's diverse halal food scene, from traditional to fusion cuisines.",
    },
    {
        name: "Austin",
        slug: "austin",
        state: "Texas",
        description:
            "Find halal versions of Texas favorites and international cuisine in the state capital.",
    },
];

export const getCitiesByState = (state: string): City[] => {
    return cities.filter(
        (city) => city.state.toLowerCase() === state.toLowerCase()
    );
};

export const getCityBySlug = (slug: string): City | undefined => {
    return cities.find((city) => city.slug === slug);
};
