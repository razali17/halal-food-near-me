import { CuisineType } from "../types";

export const cuisines: CuisineType[] = [
    {
        id: "mexican",
        name: "Mexican",
        description:
            "Authentic halal Mexican food combining traditional flavors with halal ingredients. Enjoy tacos, burritos, and enchiladas prepared according to Islamic dietary laws.",
        image: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg",
    },
    {
        id: "chinese",
        name: "Chinese",
        description:
            "Halal Chinese cuisine offering a diverse range of dishes from stir-fries to dumplings, all prepared with halal meat and ingredients that comply with Islamic dietary guidelines.",
        image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg",
    },
    {
        id: "indian",
        name: "Indian",
        description:
            "Flavorful halal Indian food featuring aromatic spices and authentic recipes. From biryanis to curries, experience the rich culinary heritage with halal ingredients.",
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
    },
    {
        id: "mediterranean",
        name: "Mediterranean",
        description:
            "Halal Mediterranean cuisine showcasing dishes from Greece, Turkey, and the Middle East. Enjoy shawarma, kebabs, and falafel made with the finest halal ingredients.",
        image: "https://images.pexels.com/photos/1618898/pexels-photo-1618898.jpeg",
    },
    {
        id: "american",
        name: "American",
        description:
            "Classic American favorites reimagined with halal ingredients. From burgers and steaks to fried chicken, these dishes respect Islamic dietary requirements without compromising on taste.",
        image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
    },
    {
        id: "thai",
        name: "Thai",
        description:
            "Halal Thai food offering the perfect balance of sweet, sour, and spicy flavors. Enjoy pad thai, green curry, and tom yum soup prepared with halal ingredients.",
        image: "https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg",
    },
];

export const getCuisineById = (id: string): CuisineType | undefined => {
    return cuisines.find((cuisine) => cuisine.id === id);
};
