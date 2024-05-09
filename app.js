import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { dbConnection } from './src/config/db.js';
import BlogRoutes from './src/routes/blog.js';
import CategoryRoutes from './src/routes/category.js';
import UserRoutes from './src/routes/user.js';
import { errController } from './src/controllers/errorControllers.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/v1/api', BlogRoutes);
app.use('/v1/api', CategoryRoutes);
app.use('/v1/api', UserRoutes);
app.use(errController);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
    dbConnection()
})