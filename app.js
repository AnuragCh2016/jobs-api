import dotenv from 'dotenv'
dotenv.config();

//extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';

import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yaml')

const rateLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

import 'express-async-errors';
import express, { json } from 'express';
import {connectDB} from './db/connect.js'
import authRoute from './routes/authRoute.js'
import jobRoute from './routes/jobsRoute.js'
const app = express();


// error handler
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.set('trust proxy', 1)
app.use(rateLimiter);
app.use(json());
// extra packages
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(cors())

app.get('/',(req,res)=>{
    res.send(`<h1>Jobs API</h1>
    <a href="/api-docs">Documentation</a>`);
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument))

// routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/jobs',jobRoute);
//to use protected routes, i.e., auth middleware, we can also do -
// app.use('/api/v1/jobs',authenticationMiddleware,jobRoute)   which protects whole route

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Database connected...!")
    app.listen(port, () =>
      console.log(`Server started on port :${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
