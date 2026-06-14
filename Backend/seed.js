const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const userModel = require("./models/userModel");
const productModel = require("./models/productModel");
const orderModel = require("./models/orderModel");

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@shopnest.com",
    password: "password123",
    role: "admin",
    isVerified: true
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    isVerified: true
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    isVerified: true
  },
  {
    name: "Bob Johnson",
    email: "bob@example.com",
    password: "password123",
    role: "user",
    isVerified: true
  }
];

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 89.99,
    description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    category: "Electronics",
    brand: "SoundWave",
    stock: 50,
    rating: 4.5,
    numReviews: 12
  },
  {
    name: "Minimalist Leather Watch",
    price: 129.99,
    description: "Elegant quartz watch featuring a genuine leather strap and scratch-resistant sapphire glass.",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    category: "Accessories",
    brand: "ChronoCo",
    stock: 30,
    rating: 4.7,
    numReviews: 8
  },
  {
    name: "Ergonomic Office Chair",
    price: 199.99,
    description: "Fully adjustable ergonomic desk chair with lumbar support and breathable mesh back.",
    image_url: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&auto=format&fit=crop&q=60",
    category: "Furniture",
    brand: "ErgoComfort",
    stock: 15,
    rating: 4.3,
    numReviews: 25
  },
  {
    name: "Stainless Steel Water Bottle",
    price: 24.99,
    description: "Double-walled vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    image_url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    category: "Home & Kitchen",
    brand: "HydroPeak",
    stock: 100,
    rating: 4.6,
    numReviews: 40
  },
  {
    name: "Ultra-Thin Mechanical Keyboard",
    price: 99.99,
    description: "Compact tenkeyless layout mechanical keyboard with low-profile red switches and RGB backlighting.",
    image_url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    category: "Electronics",
    brand: "KeyClick",
    stock: 20,
    rating: 4.8,
    numReviews: 15
  },
  {
    name: "Smart Fitness Tracker",
    price: 49.99,
    description: "Waterproof fitness band tracking heart rate, sleep steps, and active minutes with 7-day battery life.",
    image_url: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&auto=format&fit=crop&q=60",
    category: "Electronics",
    brand: "FitTrack",
    stock: 75,
    rating: 4.2,
    numReviews: 18
  },
  {
    name: "Ceramic Coffee Mug Set",
    price: 34.99,
    description: "Set of 4 hand-painted ceramic mugs, microwave and dishwasher safe, perfect for morning coffee.",
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60",
    category: "Home & Kitchen",
    brand: "ClayArt",
    stock: 40,
    rating: 4.4,
    numReviews: 9
  },
  {
    name: "Eco-Friendly Yoga Mat",
    price: 39.99,
    description: "Non-slip, extra thick yoga mat made from biodegradable TPE material with alignment lines.",
    image_url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60",
    category: "Fitness",
    brand: "GreenFit",
    stock: 60,
    rating: 4.6,
    numReviews: 14
  }
];

const seedDatabase = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    console.log("Connecting to Database...");
    await mongoose.connect(mongoUrl);
    console.log("Database connected successfully.");

    // Clear existing data
    console.log("Clearing existing data...");
    await userModel.deleteMany({});
    await productModel.deleteMany({});
    await orderModel.deleteMany({});
    console.log("Existing data cleared.");

    // Hash passwords for seed users
    console.log("Hashing user passwords...");
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 14);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );

    // Insert new users
    console.log("Inserting users...");
    const createdUsers = await userModel.insertMany(hashedUsers);
    console.log("Users inserted successfully.");

    // Insert new products
    console.log("Inserting products...");
    const createdProducts = await productModel.insertMany(products);
    console.log("Products inserted successfully.");

    // Select dynamic users and products for creating orders
    const johnUser = createdUsers.find(u => u.email === "john@example.com");
    const janeUser = createdUsers.find(u => u.email === "jane@example.com");
    const bobUser = createdUsers.find(u => u.email === "bob@example.com");

    const headphones = createdProducts.find(p => p.name === "Wireless Bluetooth Headphones");
    const waterBottle = createdProducts.find(p => p.name === "Stainless Steel Water Bottle");
    const watch = createdProducts.find(p => p.name === "Minimalist Leather Watch");
    const yogaMat = createdProducts.find(p => p.name === "Eco-Friendly Yoga Mat");

    // Construct orders using mapped IDs
    const orders = [
      {
        user: johnUser._id,
        items: [
          { product: headphones._id, quantity: 1 },
          { product: waterBottle._id, quantity: 2 }
        ],
        address: {
          fullName: "John Doe",
          addressLine1: "456 Oak Avenue",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400002",
          phoneNumber: "9876543210"
        },
        totalAmount: (headphones.price * 1) + (waterBottle.price * 2),
        status: "completed",
        paymentMethod: "creditCard"
      },
      {
        user: janeUser._id,
        items: [
          { product: watch._id, quantity: 1 }
        ],
        address: {
          fullName: "Jane Smith",
          addressLine1: "789 Pine Road",
          city: "Pune",
          state: "Maharashtra",
          zipCode: "411001",
          phoneNumber: "9123456789"
        },
        totalAmount: watch.price * 1,
        status: "pending",
        paymentMethod: "cashOnDelivery"
      },
      {
        user: bobUser._id,
        items: [
          { product: yogaMat._id, quantity: 2 },
          { product: waterBottle._id, quantity: 1 }
        ],
        address: {
          fullName: "Bob Johnson",
          addressLine1: "101 Cedar Lane",
          city: "Bangalore",
          state: "Karnataka",
          zipCode: "560001",
          phoneNumber: "9345678901"
        },
        totalAmount: (yogaMat.price * 2) + (waterBottle.price * 1),
        status: "pending",
        paymentMethod: "debitCard"
      }
    ];

    console.log("Inserting orders...");
    await orderModel.insertMany(orders);
    console.log("Orders inserted successfully.");

    console.log("Database seeded successfully with users, products, and orders!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
