import mongoose from "mongoose";
import dotenv from "dotenv";
import csv from "csvtojson";
import fs from "fs";
import path from "path";
import Product from "./models/Product.js";

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const folderPath = "./data";
    const files = fs.readdirSync(folderPath);

    let allProducts = [];

    // loop through all CSV files
    for (const file of files) {
      if (file.endsWith(".csv")) {
        const filePath = path.join(folderPath, file);

        console.log("Reading:", file);

        const products = await csv().fromFile(filePath);

        const formatted = products.map(item => {
            const priceValue = parseFloat(
                item.final_price?.replace(/[^0-9.]/g, "")
            );


            return {
                title: item.title,

                description: item.product_description || "",

                price: isNaN(priceValue) ? 0 : priceValue,

                category: item.category || "General",

                stock: 10,

                images: item.images
                ? (() => {
                    try {
                        return JSON.parse(item.images).map(url => ({
                        url,
                        publicId: "dummy"
                        }));
                    } catch {
                        return [{
                        url: item.images,
                        publicId: "dummy"
                        }];
                    }
                    })()
                : []
            };
            });

        allProducts.push(...formatted);
      }
    }

    // optional: clear old data
    await Product.deleteMany();

    // insert all products
    await Product.insertMany(allProducts);

    console.log(`Imported ${allProducts.length} products ✅`);
    process.exit();

  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

importData();
