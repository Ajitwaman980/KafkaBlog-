import { Router } from "express";
import { Authverify } from "../middleware/auth.js";
import { isowner } from "../middleware/isowner.js";
import {
  Newpost,
  updatePost,
  deletePost,
  Allpost,
  getPostById,
} from "../controller/postController.js";
import { addComment, deleteComment } from "../controller/commentPost.js";
const router = Router();
// post controller
router.get("/all", Allpost);
router.get("/:id", Authverify, getPostById); // get post by id
router.post("/new", Authverify, Newpost);
router.put("/update/:id", Authverify, isowner, updatePost);
router.delete("/delete/:id", Authverify, isowner, deletePost);
// comments controller
router.post("/:postId/comments", Authverify, addComment);
router.delete("/:postId/comments/:commentId", Authverify, deleteComment);
export default router;
