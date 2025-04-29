import mongoose from "mongoose";

mongoose
  .connect("mongodb://localhost/microservices_user_services")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(() => {
    console.error("Failed to connect to MongoDB");
  });

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 20 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, maxlength: 100 },
});

export const usermodel = mongoose.model("User", userSchema);
// export default usermodel;
