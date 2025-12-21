const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/productModel');

const productsToUpdate = [
    { name: "Test Product", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVybml0dXJlfGVufDB8fDB8fHww" }, // Generic furniture
    { name: "Vintage Brass Lamp", image: "https://thebombaystore.com/cdn/shop/products/TBS13795_2_500x.jpg?v=1634206681" },
    { name: "Handmade Copper Pot", image: "https://thebombaystore.com/cdn/shop/files/01_d45e658a-1a9c-415f-842c-2eecc19443ee.jpg?v=1664782679" }, // Copper-like image from hero
    { name: "Kalamkari Wall Art", image: "https://thebombaystore.com/cdn/shop/files/Collection_Kalamkari.jpg?v=1664781209" },
    { name: "Wooden Elephant Statue", image: "https://thebombaystore.com/cdn/shop/products/04_a2d52f24-a4a1-49e8-b9e3-241026207918_500x.jpg?v=1648648942" }, // Elephant image
    { name: "Ceramic Flower Vase", image: "https://thebombaystore.com/cdn/shop/files/Resin.jpg?v=1687499076" } // Decor image
];

const updateImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const item of productsToUpdate) {
            const result = await Product.updateOne(
                { name: item.name },
                { $set: { image: item.image } }
            );

            if (result.matchedCount > 0) {
                console.log(`Updated image for: ${item.name}`);
            } else {
                console.log(`Product NOT FOUND: ${item.name}`);
            }
        }

        console.log('All updates attempted.');
        process.exit();
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();
