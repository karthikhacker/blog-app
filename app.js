import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { dbConnection } from './src/config/db.js';
const app = express();

let port = process.env.PORT || 5000;

app.listen(() => {
    console.log('App listening at port ', port)
    dbConnection()
})