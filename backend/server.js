import express from 'express';
import path from 'path';
import products from './data/products.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js'
dotenv.config();

connectDB();

const port = process.env.PORT || 5000;
const app = express();

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cookie parser middleware
app.use(cookieParser());

const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static(path.join(__dirname, 'frontend/build')));

    //any route that is not api will be redirected to index.html
    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));