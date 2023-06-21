import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './utils/db';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import errorMiddleware from './middlewares/error.middleware';

dotenv.config();


const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use('/api/v1', userRouter);

// Error Middleware
app.use(errorMiddleware)

// Database Connection

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`App listening on the port ${process.env.PORT}`);
    }
    );
});



