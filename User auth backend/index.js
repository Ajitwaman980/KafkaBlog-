import express, { json } from "express";
import zod from "zod";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// import cookie_parser from "cookies-parser";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import Authverify from "./src/middleware/auth.js";
import cors from "cors";
import { Kafka } from "kafkajs";
const app = express();
// cors
// app.use(
//   cors({
//     origin: "http://localhost:4002",
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(cookieParser());
// Connect to MongoDB
mongoose
  .connect("mongodb://localhost/microservices_user_services")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.error("Failed to connect to MongoDB");
  });

//   user schema

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
});

const UserService = mongoose.model("User", userSchema);
export default UserService;
//   user sign up
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new UserService({
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    const token = jwt.sign(
      { id: newUser._id, username: user.username, email: user.email },
      "myscert"
    );
    res.cookie("token", token);
    // kafka
    await sendUserCreatedEvent(newUser._id, token);
    res.status(201).json({ message: "User created successfully", token });
  } catch (er) {
    console.log(er);
    res.send(er);
  }
});
// login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      "myscert"
    );
    res.cookie("token", token);
    // id
    const userId = user._id;
    await sendUserUserLoginEvent(userId, token);
    res.json({ message: "Logged in successfully", token });
  } catch (er) {
    console.log(er);
    res.send(er);
  }
});

// logout
app.get("/logout", Authverify, function (req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

app.get("/profile", Authverify, async function (req, res) {
  try {
    const id = req.user.id;
    const userProfile = await UserService.findById(id);
    if (!userProfile)
      return res.status(404).json({ message: "User not found" });
    res.json({ userProfile: userProfile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
    return;
  }
});

// kafkajs
const kafka = new Kafka({
  clientID: "user-service",
  brokers: ["localhost:9092"],
});
// produces the messages
const producer = kafka.producer();
// connections to kafak producer
async function startKafkaProducer() {
  await producer.connect(); // connect to kafak producer
  console.log("Kafka producer is ready");
}
//  send user sendUserCreatedEvent

const sendUserCreatedEvent = async (userid, token) => {
  await producer.send({
    topic: "usercreated_event", //this is topic

    messages: [
      {
        value: JSON.stringify({
          message: "new user created in user services",
          userId: userid,
          token: token,
        }),
      },
    ],
  });
  console.log(
    `Event sent: New User with ID ${userid} created  and token ${token}`
  );
};
// login microservices
const sendUserUserLoginEvent = async (userid, token) => {
  await producer.send({
    topic: "Userlogin", //this is topic

    messages: [
      {
        value: JSON.stringify({
          message: " user Login in user services",
          userId: userid,
          token: token,
        }),
      },
    ],
  });
  console.log(`Event sent: User with ID ${userid} login and token ${token}`);
};

// start
startKafkaProducer();

app.listen(4001, () => {
  console.log("Server is running on port 4001");
});
