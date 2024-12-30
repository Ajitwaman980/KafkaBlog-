import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();
const Authverify = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ message: "user not unauthorized" });
    }
    const decode = jwt.verify(token, "myscert");
    if (!decode) {
      return res.json({ message: "user not unauthorized" });
    }
    req.user = decode;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
    return;
  }
};
export default Authverify;
