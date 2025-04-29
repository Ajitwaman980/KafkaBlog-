import { Router } from "express";
import { Authverify } from "../middleware/auth.js";
import {
  Newpost,
  updatePost,
  deletePost,
  Allpost,
} from "../controller/postController.js";
import { addComment, deleteComment } from "../controller/commentPost.js";
const router = Router();
// post controller
router.get("/all", Allpost);
router.post("/new", Authverify, Newpost);
router.put("/update/:id", Authverify, updatePost);
router.delete("/delete/:id", Authverify, deletePost);
// comments controller
router.post("/:postId/comments", Authverify, addComment);
router.delete("/:postId/comments/:commentId", Authverify, deleteComment);
export default router;
