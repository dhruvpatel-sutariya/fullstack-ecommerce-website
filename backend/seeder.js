const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const User = require('./models/User');
const products = require('./data/products');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    console.log('Clearing products...');
    await Product.deleteMany();
    console.log('Clearing users...');
    await User.deleteMany();

    console.log('Creating admin useClearing users...
Creating admin user...
Admin created: admin@quickmart.test
Inserting products...
Data Imported!
Admin login: admin@quickmart.test / admin123r...');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@quickmart.test',
      password: 'admin123',
      isAdmin: true,
    });
    console.log('Admin created:', adminUser.email);

    const sampleProducts = products.map(product => ({
      ...product,
      reviews: [],
    }));

    console.log('Inserting products...');
    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    console.log('Admin login: admin@quickmart.test / admin123');
    process.exit();
  } catch (error) {
    console.error('Seeder error:', error);
    process.exit(1);
  }
};

importData();
