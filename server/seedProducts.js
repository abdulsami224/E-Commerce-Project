import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import csv from 'csvtojson';
import Product from './models/Product.js';

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB:', mongoose.connection.db.databaseName); // ← add this

    const folderPath = './data';
    const files = fs.readdirSync(folderPath);

    let allProducts = [];

    for (const file of files) {
      if (!file.endsWith('.csv')) continue;

      const filePath = path.join(folderPath, file);
      console.log('Reading:', file);

      const products = await csv().fromFile(filePath);

      const formatted = products
        .map(item => {
          const priceValue = parseFloat(
            item.final_price?.toString().replace(/[^0-9.]/g, '') || '0'
          );

          let images = [];
          if (item.images) {
            try {
              const parsed = JSON.parse(item.images);
              images = Array.isArray(parsed)
                ? parsed.map(url => ({ url: url.trim(), publicId: 'seeded' }))
                : [{ url: item.images.trim(), publicId: 'seeded' }];
            } catch {
              images = [{ url: item.images.trim(), publicId: 'seeded' }];
            }
          }

          if (!item.title || item.title.trim() === '') return null;

          return {
            title: item.title.trim(),
            description: item.product_description?.trim() || '',
            price: isNaN(priceValue) ? 0 : priceValue,
            category: item.category?.trim().toLowerCase() || 'general',
            stock: 10,
            images,
          };
        })
        .filter(Boolean); 

      console.log(`  → ${formatted.length} valid products from ${file}`);
      allProducts.push(...formatted);
    }

    await Product.deleteMany();
    console.log('Existing products cleared');

    await Product.insertMany(allProducts);
    console.log(`Imported ${allProducts.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

importData();