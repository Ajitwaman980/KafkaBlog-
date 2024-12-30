import PostService from "../model/postModel.js";
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    const { id: userId, username } = req.user;

    const post = await PostService.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = { userId, username, comment };
    post.comments.push(newComment);

    await post.save();
    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Comment not added " });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const post = await PostService.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // const commentToDelete = post.comments.id(commentId);

    commentToDelete.remove();
    await post.save();
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "comment not deleted error" });
  }
};
