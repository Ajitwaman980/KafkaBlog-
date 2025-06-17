import express from "express";
import redis from "../config/redis.js";
import jwt from "jsonwebtoken";
import PostService from "../model/postModel.js";
export const isowner = async (req, res, next) => {
  try {
    const userid = req.user.id; //getting from middleware
    // console.log(userid);
    const postid = req.params.id; // getting the post id
    const post = await PostService.findById(postid);
    if (!post) {
      return res.json({ error: "post not found... " });
    }
    // console.log(post.user.id.toString());
    if (post.user.id.toString() !== userid) {
      return res
        .status(403)
        .json({ error: "You are not the owner of this post" });
    }
    next();
  } catch (error) {
    console.log("this error auhorization ");
    res.json(error);
  }
};
