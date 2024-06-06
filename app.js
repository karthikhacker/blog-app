import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit'
import 'dotenv/config'
import { dbConnection } from './src/config/db.js';
import BlogRoutes from './src/routes/blog.js';
import CategoryRoutes from './src/routes/category.js';
import UserRoutes from './src/routes/user.js';
import { errController } from './src/controllers/errorControllers.js';

const app = express();

const limiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 200,
    message: 'Too many requests,Try again'
})
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize())
app.use(cors());
app.use(limiter);
app.use(helmet());
app.use('/v1/api', BlogRoutes);
app.use('/v1/api', CategoryRoutes);
app.use('/v1/api', UserRoutes);
app.use(errController);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
    dbConnection()
})