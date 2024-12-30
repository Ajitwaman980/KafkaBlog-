import express from "express";
import cookieParser from "cookie-parser";
import { Redis } from "ioredis";
// create the redis
const redis = new Redis({
  port: 6379,
});
import connectToDatabase from "./db/db.js";
import postRoutes from "./routes/post.js";
import { Kafka } from "kafkajs";

const app = express();
app.use(express.json());
app.use(cookieParser());
connectToDatabase();
//
// kafka
const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "post-service",
});

const consumer = kafka.consumer({ groupId: "post-group" });
const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log("Kafka Consumer connected successfully");

    await consumer.subscribe({ topic: "usercreated_event" });
    await consumer.subscribe({ topic: "Userlogin", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { userId, token } = JSON.parse(message.value.toString());
        // console.log(`Received message: ${message.value.toString()}`);
        console.log("this is topic ", topic);
        console.log("this is token of user ", token);
        console.log("this is userId ", userId);
        // Userlogin event
        if (topic === "Userlogin" || topic === "usercreated_event") {
          // Store token in Redis with 1-hour expiry
          console.log(`Storing token for user ${userId}`);
          await redis.set(userId, token, "EX", 3600);
        }
      },
    });
  } catch (err) {
    console.error("Error in Kafka Consumer:", err);
    setTimeout(startKafkaConsumer, 5000); // Retry after 5 seconds
  }
};

// satart
startKafkaConsumer();

// middleware
app.use("/posts", postRoutes);

app.listen(4002, () => {
  console.log("Server is running on port 4002");
});
