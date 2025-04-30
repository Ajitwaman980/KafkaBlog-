import { Kafka } from "kafkajs";
import redis from "./config/redis.js";
const kafka = new Kafka({
  brokers: ["localhost:9092"],
  clientId: "post-service",
});
//  asynchronous talking with backend 2  authentication service
//  and redis for caching the data
export const consumer = kafka.consumer({ groupId: "post-group" });
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
        // console.log("this is topic ", topic);
        // console.log("this is token of user ", token);
        // console.log("this is userId ", userId);
        // Userlogin event
        if (topic === "Userlogin" || topic === "usercreated_event") {
          // Store token in Redis with 1-hour expiry
          console.log(`Storing token for user ${userId}`);
          await redis.set(userId, token, "EX", 3600);
        }
      },
    });
  } catch (err) {
    // console.error("Error in Kafka Consumer:", err);
    setTimeout(startKafkaConsumer, 5000); // Retry after 5 seconds
  }
};

export default startKafkaConsumer;
