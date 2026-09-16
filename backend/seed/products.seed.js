const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("../config/db");
const Product = require("../models/Product");

const products = [
  // ================= SADDLES =================
  {
    name: "The Heritage Saddle",
    description:
      "A premium handcrafted saddle inspired by traditional Indian equestrian craftsmanship.",
    shortDescription:
      "Handcrafted premium heritage saddle.",
    price: 48500,
    category: "SADDLES",
    image:
      "https://i.ebayimg.com/images/g/FRwAAeSwYWFousRY/s-l1200.jpg",
    stock: 15,
    lowStockThreshold: 3,
    badge: "BESTSELLER",
    featured: true,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["saddle", "heritage", "english"],
  },

  {
    name: "Rajputana Dressage Saddle",
    description:
      "Elegant dressage saddle combining refined comfort with Indian-inspired craftsmanship.",
    shortDescription:
      "Elegant dressage saddle for refined riding.",
    price: 56800,
    category: "SADDLES",
    image:
      "https://tiimg.tistatic.com/fp/1/005/240/indian-leather-horse-dressage-saddle-594.jpg",
    stock: 10,
    lowStockThreshold: 3,
    badge: "",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["saddle", "dressage", "rajputana"],
  },

  {
    name: "The Maharaja Saddle",
    description:
      "Signature premium saddle designed around timeless Indian royal equestrian aesthetics.",
    shortDescription:
      "Our signature royal saddle.",
    price: 72500,
    category: "SADDLES",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=85",
    stock: 8,
    lowStockThreshold: 2,
    badge: "SIGNATURE",
    featured: true,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["saddle", "maharaja", "signature"],
  },

  {
    name: "Classic English Saddle",
    description:
      "Classic English saddle designed for balanced positioning and everyday performance.",
    shortDescription:
      "Classic English riding saddle.",
    price: 42900,
    category: "SADDLES",
    image:
      "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1200&q=85",
    stock: 18,
    lowStockThreshold: 4,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["saddle", "english", "classic"],
  },

  {
    name: "Polo Heritage Saddle",
    description:
      "Performance-focused polo saddle with a heritage-inspired leather finish.",
    shortDescription:
      "Heritage saddle crafted for polo.",
    price: 61500,
    category: "SADDLES",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1200&q=85",
    stock: 9,
    lowStockThreshold: 3,
    badge: "NEW",
    featured: true,
    bestSeller: false,
    newArrival: true,
    isActive: true,
    tags: ["saddle", "polo", "heritage"],
  },

  {
    name: "Royal Endurance Saddle",
    description:
      "Lightweight endurance saddle designed for long-distance comfort and stability.",
    shortDescription:
      "Lightweight saddle for endurance riding.",
    price: 53400,
    category: "SADDLES",
    image:
      "https://images.unsplash.com/photo-1553284965-fa9b7c5d6e7b?auto=format&fit=crop&w=1200&q=85",
    stock: 12,
    lowStockThreshold: 3,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["saddle", "endurance", "riding"],
  },

  // ================= BRIDLES =================

  {
    name: "Rajputana Ceremonial Bridle",
    description:
      "Statement ceremonial bridle inspired by India's royal equestrian traditions.",
    shortDescription:
      "A signature ceremonial bridle.",
    price: 12800,
    category: "BRIDLES",
    image:
      "https://images.squarespace-cdn.com/content/v1/685136bfb31e545b005f2971/0eeec78a-14ec-47a1-b4ed-d3abf2d545f6/marwari_warrior.jpg",
    stock: 14,
    lowStockThreshold: 3,
    badge: "SIGNATURE",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["bridle", "ceremonial", "rajputana"],
  },

  {
    name: "Braided Heritage Bridle",
    description:
      "Hand-finished leather bridle with detailed braided accents.",
    shortDescription:
      "Braided leather heritage bridle.",
    price: 14600,
    category: "BRIDLES",
    image:
      "https://tiimg.tistatic.com/fp/1/009/282/premium-leather-horse-bridle-with-braided-reins-746.jpg",
    stock: 16,
    lowStockThreshold: 3,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["bridle", "leather", "braided"],
  },

  {
    name: "The Polo Bridle",
    description:
      "Refined polo bridle designed for confident handling and everyday performance.",
    shortDescription:
      "Performance polo bridle.",
    price: 11900,
    category: "BRIDLES",
    image:
      "https://images.unsplash.com/photo-1598974357801-cbca100e65d3?auto=format&fit=crop&w=1100&q=85",
    stock: 20,
    lowStockThreshold: 4,
    badge: "",
    featured: false,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["bridle", "polo"],
  },

  {
    name: "Classic Hunter Bridle",
    description:
      "Timeless hunter bridle made for clean styling and dependable everyday use.",
    shortDescription:
      "Classic hunter leather bridle.",
    price: 10800,
    category: "BRIDLES",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1100&q=85",
    stock: 17,
    lowStockThreshold: 3,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["bridle", "hunter", "classic"],
  },

  {
    name: "Marwari Heritage Bridle",
    description:
      "Distinctive bridle celebrating the iconic Marwari equestrian heritage.",
    shortDescription:
      "Inspired by Marwari heritage.",
    price: 16800,
    category: "BRIDLES",
    image:
      "https://www.cheval-daventure.com/photos/600x400/cheval-en-inde-11062.jpg",
    stock: 11,
    lowStockThreshold: 3,
    badge: "NEW",
    featured: true,
    bestSeller: false,
    newArrival: true,
    isActive: true,
    tags: ["bridle", "marwari", "heritage"],
  },

  {
    name: "The Black Label Bridle",
    description:
      "Minimal black leather bridle with a sophisticated premium finish.",
    shortDescription:
      "Premium black leather bridle.",
    price: 15400,
    category: "BRIDLES",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=85",
    stock: 13,
    lowStockThreshold: 3,
    badge: "",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["bridle", "black", "premium"],
  },

  // ================= RIDER =================

  {
    name: "Jodhpur Riding Boots",
    description:
      "Premium Jodhpur boots inspired by the heritage of Indian riding culture.",
    shortDescription:
      "Handcrafted Jodhpur riding boots.",
    price: 18900,
    category: "RIDER",
    image:
      "https://www.blkbrdshoemaker.com/cdn/shop/files/Umaid-X-Jodhpuri-Boot-Toscanello-Horserump.jpg",
    stock: 25,
    lowStockThreshold: 5,
    badge: "BESTSELLER",
    featured: true,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["boots", "rider", "jodhpur"],
  },

  {
    name: "The Heritage Riding Jacket",
    description:
      "Structured riding jacket combining timeless tailoring with equestrian functionality.",
    shortDescription:
      "Tailored heritage riding jacket.",
    price: 24500,
    category: "RIDER",
    image:
      "https://images.unsplash.com/photo-1520975958225-5f61d3b9c1b1?auto=format&fit=crop&w=1100&q=85",
    stock: 14,
    lowStockThreshold: 3,
    badge: "",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["jacket", "rider", "apparel"],
  },

  {
    name: "Classic Riding Gloves",
    description:
      "Comfortable riding gloves designed for grip, control and everyday riding.",
    shortDescription:
      "Premium everyday riding gloves.",
    price: 4800,
    category: "RIDER",
    image:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1100&q=85",
    stock: 40,
    lowStockThreshold: 8,
    badge: "",
    featured: false,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["gloves", "rider"],
  },

  {
    name: "Rajputana Bandhgala",
    description:
      "A refined bandhgala inspired by Indian royal tailoring and equestrian style.",
    shortDescription:
      "Indian-inspired equestrian bandhgala.",
    price: 28900,
    category: "RIDER",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1100&q=85",
    stock: 10,
    lowStockThreshold: 2,
    badge: "NEW",
    featured: true,
    bestSeller: false,
    newArrival: true,
    isActive: true,
    tags: ["bandhgala", "rider", "indian"],
  },

  {
    name: "Jodhpur Breeches",
    description:
      "Flexible riding breeches designed for comfort and movement in the saddle.",
    shortDescription:
      "Comfort-fit riding breeches.",
    price: 9200,
    category: "RIDER",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85",
    stock: 30,
    lowStockThreshold: 6,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["breeches", "rider", "apparel"],
  },

  {
    name: "The Equestrian Field Coat",
    description:
      "Premium field coat designed for polished equestrian styling and outdoor comfort.",
    shortDescription:
      "Signature equestrian field coat.",
    price: 31500,
    category: "RIDER",
    image:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1100&q=85",
    stock: 8,
    lowStockThreshold: 2,
    badge: "SIGNATURE",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["coat", "rider", "signature"],
  },

  // ================= HORSE CARE =================

  {
    name: "Royal Grooming Set",
    description:
      "Complete grooming collection for maintaining your horse with care and precision.",
    shortDescription:
      "Complete premium horse grooming set.",
    price: 6800,
    category: "HORSE CARE",
    image:
      "https://c.ndtvimg.com/2024-02/3u1k306_marwar-horse-show_625x300_01_February_24.jpg?im=FitAndFill%2Calgorithm%3Ddnn%2Cwidth%3D1200%2Cheight%3D675",
    stock: 22,
    lowStockThreshold: 5,
    badge: "BESTSELLER",
    featured: true,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["grooming", "horse-care"],
  },

  {
    name: "Heritage Stable Brush",
    description:
      "Durable stable brush designed for daily grooming and care.",
    shortDescription:
      "Essential daily grooming brush.",
    price: 2400,
    category: "HORSE CARE",
    image:
      "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1100&q=85",
    stock: 50,
    lowStockThreshold: 10,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["brush", "grooming"],
  },

  {
    name: "Leather Grooming Bag",
    description:
      "Premium leather grooming bag with practical storage for stable essentials.",
    shortDescription:
      "Handcrafted leather grooming bag.",
    price: 8900,
    category: "HORSE CARE",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=85",
    stock: 18,
    lowStockThreshold: 4,
    badge: "",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["grooming", "bag", "leather"],
  },

  {
    name: "Stable Care Kit",
    description:
      "Practical stable-care essentials assembled into one convenient kit.",
    shortDescription:
      "Everyday stable care essentials.",
    price: 5400,
    category: "HORSE CARE",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1100&q=85",
    stock: 24,
    lowStockThreshold: 5,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["stable", "horse-care", "kit"],
  },

  {
    name: "Equine Travel Kit",
    description:
      "Organised travel kit for keeping essential horse-care items close while travelling.",
    shortDescription:
      "Travel-ready equine care kit.",
    price: 7600,
    category: "HORSE CARE",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1100&q=85",
    stock: 16,
    lowStockThreshold: 3,
    badge: "NEW",
    featured: true,
    bestSeller: false,
    newArrival: true,
    isActive: true,
    tags: ["travel", "horse-care", "kit"],
  },

  {
    name: "The Stable Keeper Set",
    description:
      "Premium stable-care collection created for organised daily horse care.",
    shortDescription:
      "Premium stable keeper collection.",
    price: 11200,
    category: "HORSE CARE",
    image:
      "https://images.unsplash.com/photo-1551884831-bbf3cdc6469e?auto=format&fit=crop&w=1100&q=85",
    stock: 12,
    lowStockThreshold: 3,
    badge: "",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["stable", "horse-care", "premium"],
  },

  // ================= LEATHER GOODS =================

  {
    name: "Handcrafted Indian Leather Belt",
    description:
      "Handcrafted Indian leather belt combining traditional detailing with modern styling.",
    shortDescription:
      "Handcrafted Indian leather belt.",
    price: 6500,
    category: "LEATHER GOODS",
    image:
      "https://celticindia.com/cdn/shop/files/08_d8450b9d-3bd5-4dd3-8e22-57e56257c72c.jpg?v=1754893422",
    stock: 30,
    lowStockThreshold: 6,
    badge: "BESTSELLER",
    featured: true,
    bestSeller: true,
    newArrival: false,
    isActive: true,
    tags: ["belt", "leather", "indian"],
  },

  {
    name: "The Maharaja Leather Belt",
    description:
      "Statement leather belt inspired by the refined character of Indian royal craftsmanship.",
    shortDescription:
      "Royal-inspired leather belt.",
    price: 7200,
    category: "LEATHER GOODS",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=85",
    stock: 25,
    lowStockThreshold: 5,
    badge: "",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["belt", "leather", "maharaja"],
  },

  {
    name: "Heritage Leather Wallet",
    description:
      "Classic leather wallet crafted for everyday use with timeless equestrian character.",
    shortDescription:
      "Classic handcrafted leather wallet.",
    price: 5800,
    category: "LEATHER GOODS",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1100&q=85",
    stock: 35,
    lowStockThreshold: 7,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["wallet", "leather"],
  },

  {
    name: "Royal Leather Card Holder",
    description:
      "Compact premium leather card holder designed for understated everyday elegance.",
    shortDescription:
      "Minimal premium leather card holder.",
    price: 3900,
    category: "LEATHER GOODS",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1100&q=85",
    stock: 40,
    lowStockThreshold: 8,
    badge: "",
    featured: false,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["card-holder", "leather"],
  },

  {
    name: "Equestrian Weekender",
    description:
      "Spacious leather weekender designed for riding trips and refined travel.",
    shortDescription:
      "Premium equestrian leather weekender.",
    price: 24900,
    category: "LEATHER GOODS",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1100&q=85",
    stock: 10,
    lowStockThreshold: 2,
    badge: "SIGNATURE",
    featured: true,
    bestSeller: false,
    newArrival: false,
    isActive: true,
    tags: ["weekender", "travel", "leather"],
  },

  {
    name: "The Stable Leather Tote",
    description:
      "Elegant leather tote designed for everyday use with a refined stable-inspired aesthetic.",
    shortDescription:
      "Refined everyday leather tote.",
    price: 15900,
    category: "LEATHER GOODS",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1100&q=85",
    stock: 15,
    lowStockThreshold: 3,
    badge: "NEW",
    featured: true,
    bestSeller: false,
    newArrival: true,
    isActive: true,
    tags: ["tote", "leather", "stable"],
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    console.log("Connected to MongoDB");

    // Remove existing products so the seed remains clean.
    await Product.deleteMany({});

    console.log("Existing products removed");

    const createdProducts = await Product.insertMany(
      products
    );

    console.log(
      `${createdProducts.length} products inserted successfully`
    );

    process.exit(0);
  } catch (error) {
    console.error(
      "Product seed error:",
      error.message
    );

    process.exit(1);
  }
};

seedProducts();