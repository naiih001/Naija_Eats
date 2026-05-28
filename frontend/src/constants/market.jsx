import { GrainIcon, LeafIcon, ProteinIcon, SpiceIcon } from "./icons";

export const MarketData = [
  {
    category: "Grains",
    icon: <GrainIcon />,
    items: [
      { name: "Rice", qty: "1 kg", price: 1200, bought: false },
      { name: "Spaghetti", qty: "1 pack", price: 1000, bought: false },
      { name: "Bread", qty: "2 loaves", price: 1200, bought: false },
      { name: "Yam", qty: "1 (S)", price: 700, bought: false },
      { name: "Garri", qty: "1 paint", price: 600, bought: false },
    ],
  },
  {
    category: "Proteins",
    icon: <ProteinIcon />,
    items: [
      { name: "Eggs", qty: "1/2 crate", price: 1500, bought: false },
      { name: "Fish", qty: "1 (M)", price: 900, bought: false },
      { name: "Beef", qty: "1 (S)", price: 500, bought: false },
    ],
  },
  {
    category: "Vegetables",
    icon: <LeafIcon />,
    items: [
      { name: "Tomatoes", qty: "10 pieces", price: 400, bought: false },
      {
        name: "Red Bell Peppers(Tatashe)",
        qty: "4 (L)",
        price: 300,
        bought: false,
      },
      {
        name: "Scotch Bonnet Peppers (Rodo)",
        qty: "3 (L)",
        price: 200,
        bought: false,
      },
      { name: "Onions", qty: "2 (M)", price: 200, bought: false },
      { name: "Garlic", qty: "1 bulb", price: 150, bought: false },
      { name: "Ginger", qty: "1 piece", price: 100, bought: false },
      { name: "Egusi", qty: "1 cup", price: 350, bought: false },
      { name: "Ogbono", qty: "1 cup", price: 350, bought: false },
    ],
  },
  {
    category: "Spices",
    icon: <SpiceIcon />,
    items: [
      {
        name: "Curry Powder",
        qty: "1 satchet",
        price: 100,
        bought: false,
      },
      { name: "Thyme", qty: "1 satchet", price: 100, bought: false },
      { name: "Paprika", qty: "1 satchet", price: 150, bought: false },
      { name: "Black Pepper", qty: "1 bottle", price: 200, bought: false },
      { name: "Chili Pepper", qty: "1 bottle", price: 200, bought: false },
      { name: "Bay Leaves", qty: "1 pack", price: 50, bought: false },
      { name: "Salt", qty: "1 pack", price: 100, bought: false },
    ],
  },
  {
    category: "Miscellaneous",
    icon: "🥣",
    items: [
      { name: "Tea & Milk", price: 300, bought: false },
      { name: "Groundnut", price: 150, bought: false },
    ],
  },
];
