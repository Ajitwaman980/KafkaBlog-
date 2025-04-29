import express from "express";
import cookieParser from "cookie-parser";
import redis from "./config/redis.js";
import connectToDatabase from "./db/db.js";
import postRoutes from "./routes/post.js";
import startKafkaConsumer from "./kafka.js";

const app = express(); // express app instance
app.use(express.json());
app.use(cookieParser()); //cookies parser

// database connection
connectToDatabase();

// Start Kafka Consumer
startKafkaConsumer();

// middleware routes
app.use("/posts", postRoutes);

app.listen(4002, () => {
  console.log("Server is running on port 4002");
});
