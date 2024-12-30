// Gateway (backend3)

const express = require("express");
const expressProxy = require("express-http-proxy");
const app = express();

// Proxy for backend1 (User service)
app.use("/user", expressProxy("http://localhost:4001"));

// Proxy for backend2 (Post service)
app.use("/post", expressProxy("http://localhost:4002"));

app.listen(4003, () => {
  console.log("Server is running on port 4003");
});
