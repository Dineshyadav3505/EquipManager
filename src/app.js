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
import { userRouter } from "./routes/user/user.routes.js";
import { productRouter } from "./routes/product/product.route.js";
import { serviceRouter } from "./routes/service/service.route.js";

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});
app.use("/api/v1",  userRouter);
app.use("/api/v1",  productRouter);
app.use("/api/v1",  serviceRouter);


export {app};