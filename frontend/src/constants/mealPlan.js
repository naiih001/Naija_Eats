export const featuredMeal = {
    day: "MONDAY",
    title: "Jollof Rice & Grilled Fish",
    description:
        "A decade proven meal that has served various generations of African Heritage.",
    time: "45 mins",
    calories: "520 kcal",
    image: "/images/jollof_fish_plantains.png",
};

export const subMeals = [
    {
        type: "BREAKFAST",
        title: "Toast and Tea",
        image: "/images/tea-bread-small-image.png",
    },
    {
        type: "DINNER",
        title: "Swallow and Egusi Soup",
        image: "/images/swallow_egusi.png",
    },
];

export const weeklyMeals = [
    {
        day: "TUESDAY",
        title: "Beans & Plantain",
        description: "A protein rich meal cooked with perfection",
        time: "30 MINS",
        image: "/images/dish.webp",
    },
    {
        day: "WEDNESDAY",
        title: "Grilled Croaker & Ofada",
        description:
            "Locally sourced Ofada rice served with peppered croaker fish.",
        time: "40 MINS",
        image: "/images/jollof-image.png",
    },
    {
        day: "THURSDAY",
        title: "Catfish Pepper Soup",
        description:
            "A light yet intensely flavorful aromatic broth with fresh catch.",
        time: "25 MINS",
        image: "/images/fisherman_soup.png",
    },
    {
        day: "FRIDAY",
        title: "Suya Spiced Beef Skewers",
        description:
            "Classic street-style Suya with yaji spice and vegetable slaw.",
        time: "20 MINS",
        image: "/images/beef_suya.png",
    },
    {
        day: "SATURDAY",
        title: "Fried Rice Platter",
        description: "Vibrant fried rice with liver, shrimp, and seasonal peas.",
        time: "50 MINS",
        image: "/images/nigerian-jollof-rice.webp",
    },
    {
        day: "SUNDAY",
        title: "Efo Riro & Pounded Yam",
        description: "Traditional spinach stew with stockfish and smoked prawns.",
        time: "45 MINS",
        image: "/images/egusi-image.png",
    },
];

export const budgetStats = (amount) => [
    { label: "WEEKLY BUDGET", value: `₦ ${amount}`, highlight: true },
    { label: "TOTAL MEALS", value: "21 Meals" },
    { label: "PREP TIME (AVG)", value: "35 Mins" },
];