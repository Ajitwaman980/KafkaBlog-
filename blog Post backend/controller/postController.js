import PostService from "../model/postModel.js";
export const Allpost = async (req, res) => {
  try {
    const posts = await PostService.find({});

    console.log("this is post", posts);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
export const Newpost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const { id: userId, username, email } = req.user;
    // console.log("this is username is ", username);

    const userPost = new PostService({
      title,
      content,
      category,
      user: {
        id: userId,
        username: username,
        email: email,
      },
    });
    await userPost.save();

    res.json(userPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    const updatedPost = await PostService.findByIdAndUpdate(
      postId,
      { ...req.body },
      { new: true }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostService.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
