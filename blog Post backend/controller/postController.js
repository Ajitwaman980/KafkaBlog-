import PostService from "../model/postModel.js";
import redis from "../config/redis.js";
export const Allpost = async (req, res) => {
  try {
    // Check if posts are cached in Redis
    const cachedPosts = await redis.get("posts");
    if (cachedPosts) {
      console.log("Fetching posts from Redis cache");
      return res.json(JSON.parse(cachedPosts));
    }
    console.log("Fetching posts from MongoDB");
    // If not cached, fetch from MongoDB
    const posts = await PostService.find({});
    // Cache the posts in Redis for 1 hour
    await redis.set("posts", JSON.stringify(posts), "EX", 3600);
    // console.log("this is post", posts);
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
    await redis.del("posts");
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

// get element by id
export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await PostService.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    await redis.del("posts");
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
    await redis.del("posts");
    const postId = req.params.id;

    await PostService.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
