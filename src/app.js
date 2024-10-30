import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// import compression from 'compression';

const app = express();

// app.use(compression())

app.use(bodyParser.json());

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true,}));

app.use(express.json({ limit: process.env.Data_Limit }));

app.use(express.urlencoded({extended: true, limit: process.env.Data_Limit}));

app.use(express.static("public"))

app.use(cookieParser());


// Routes
///////////////////////////////////////////////////////////////
import userRouter from "./routes/user/user.routes.js";

app.use("/api/v1/user", userRouter);


export {app};