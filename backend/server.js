import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js'; 
import configRoutes from './routes/configRoutes.js';// Import your routes here

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 
app.use(cors());


// Routes
app.use('/api/config', configRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
const __dirname = path.resolve(); // Get current directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Add the upload route
import uploadRoutes from './routes/uploadRoutes.js';
app.use('/api/upload', uploadRoutes);
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);
import orderRoutes from './routes/orderRoutes.js';
app.use('/api/orders', orderRoutes);    