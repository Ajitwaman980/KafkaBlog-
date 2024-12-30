import mongoose, { Types } from "mongoose";

console.log("working the backend 2");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: {
      id: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        userId: mongoose.Types.ObjectId,
        username: String,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PostService = mongoose.model("PostUserPost", postSchema);

export default PostService;
