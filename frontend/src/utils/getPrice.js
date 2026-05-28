export const getPrice = (ingredient) => {
    const { minPrice, maxPrice } = ingredient;
    if (minPrice === maxPrice) return minPrice;
    return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;
};