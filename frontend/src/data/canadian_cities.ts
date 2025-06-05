import { City } from "../types";

interface CanadianCity extends City {
    province: string;
}

export const canadianCities: CanadianCity[] = [
    // Ontario
    {
        name: "Toronto",
        slug: "toronto",
        province: "Ontario",
        description:
            "Experience diverse halal cuisine in Canada's largest city",
    },
    {
        name: "Ottawa",
        slug: "ottawa",
        province: "Ontario",
        description: "Discover halal restaurants in Canada's capital city",
    },
    {
        name: "Mississauga",
        slug: "mississauga",
        province: "Ontario",
        description: "Find authentic halal food in the Greater Toronto Area",
    },
    {
        name: "Brampton",
        slug: "brampton",
        province: "Ontario",
        description: "Explore halal dining options in Brampton",
    },

    // British Columbia
    {
        name: "Vancouver",
        slug: "vancouver",
        province: "British Columbia",
        description:
            "Discover halal restaurants in Vancouver's diverse food scene",
    },
    {
        name: "Surrey",
        slug: "surrey",
        province: "British Columbia",
        description: "Find halal dining options in Surrey",
    },

    // Alberta
    {
        name: "Calgary",
        slug: "calgary",
        province: "Alberta",
        description: "Explore Calgary's growing halal food scene",
    },
    {
        name: "Edmonton",
        slug: "edmonton",
        province: "Alberta",
        description: "Discover halal restaurants in Alberta's capital",
    },

    // Quebec
    {
        name: "Montreal",
        slug: "montreal",
        province: "Quebec",
        description: "Experience Montreal's diverse halal cuisine",
    },
    {
        name: "Quebec City",
        slug: "quebec-city",
        province: "Quebec",
        description: "Find halal restaurants in historic Quebec City",
    },
];

export const getCanadianCitiesByProvince = (
    province: string
): CanadianCity[] => {
    return canadianCities.filter((city) => city.province === province);
};
