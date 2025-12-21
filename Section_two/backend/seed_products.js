require('dotenv').config();
const mongoose = require('mongoose');
const Model = require('./models/productModel');

const url = process.env.MONGO_URI || "mongodb://localhost:27017/Project";

mongoose.connect(url)
    .then((result) => {
        console.log('connected to database');
        seedData();
    }).catch((err) => {
        console.log(err);
    });

const products = [
    {
        name: "Vintage Brass Lamp",
        price: 1200,
        category: "Brass",
        image: "uploads/brass_lamp.jpg",
        description: "A beautiful vintage brass lamp."
    },
    {
        name: "Handmade Copper Pot",
        price: 850,
        category: "Copper",
        image: "uploads/copper_pot.jpg",
        description: "Pure copper pot for health benefits."
    },
    {
        name: "Kalamkari Wall Art",
        price: 2500,
        category: "Festive",
        image: "uploads/kalamkari_art.jpg",
        description: "Traditional hand-painted wall art."
    },
    {
        name: "Wooden Elephant Statue",
        price: 550,
        category: "Wood",
        image: "uploads/wooden_elephant.jpg",
        description: "Carved wooden elephant."
    },
    {
        name: "Ceramic Flower Vase",
        price: 400,
        category: "Decor",
        image: "uploads/vase.jpg",
        description: "Elegant ceramic vase."
    }
];

const seedData = async () => {
    try {
        await Model.insertMany(products);
        console.log('Data seeded successfully');
        process.exit();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
