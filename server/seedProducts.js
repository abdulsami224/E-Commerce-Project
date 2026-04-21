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
    console.log('MongoDB Connected');

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
          // Bug 1 — price was NaN for many items, added fallback
          const priceValue = parseFloat(
            item.final_price?.toString().replace(/[^0-9.]/g, '') || '0'
          );

          // Bug 2 — images parsing was silently failing, added better fallback
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

          // Bug 3 — skip products with no title
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
        .filter(Boolean); // remove null entries (products with no title)

      console.log(`  → ${formatted.length} valid products from ${file}`);
      allProducts.push(...formatted);
    }

    // Clear then insert
    await Product.deleteMany();
    console.log('Existing products cleared');

    await Product.insertMany(allProducts);
    console.log(`✅ Imported ${allProducts.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

importData();