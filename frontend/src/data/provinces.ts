import { Province } from "../types";
import { canadianCities } from "./canadian_cities";

export const provinces: Province[] = [
    {
        name: "Alberta",
        abbreviation: "AB",
        slug: "alberta",
        cities: canadianCities
            .filter((city) => city.province === "Alberta")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "British Columbia",
        abbreviation: "BC",
        slug: "british-columbia",
        cities: canadianCities
            .filter((city) => city.province === "British Columbia")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Manitoba",
        abbreviation: "MB",
        slug: "manitoba",
        cities: canadianCities
            .filter((city) => city.province === "Manitoba")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "New Brunswick",
        abbreviation: "NB",
        slug: "new-brunswick",
        cities: canadianCities
            .filter((city) => city.province === "New Brunswick")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Newfoundland and Labrador",
        abbreviation: "NL",
        slug: "newfoundland-and-labrador",
        cities: canadianCities
            .filter((city) => city.province === "Newfoundland and Labrador")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Nova Scotia",
        abbreviation: "NS",
        slug: "nova-scotia",
        cities: canadianCities
            .filter((city) => city.province === "Nova Scotia")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Ontario",
        abbreviation: "ON",
        slug: "ontario",
        cities: canadianCities
            .filter((city) => city.province === "Ontario")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Prince Edward Island",
        abbreviation: "PE",
        slug: "prince-edward-island",
        cities: canadianCities
            .filter((city) => city.province === "Prince Edward Island")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Quebec",
        abbreviation: "QC",
        slug: "quebec",
        cities: canadianCities
            .filter((city) => city.province === "Quebec")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
    {
        name: "Saskatchewan",
        abbreviation: "SK",
        slug: "saskatchewan",
        cities: canadianCities
            .filter((city) => city.province === "Saskatchewan")
            .map((city) => ({ name: city.name, slug: city.slug })),
    },
];
