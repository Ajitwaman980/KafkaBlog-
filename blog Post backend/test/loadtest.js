// test-load.js
// const autocannon = require('autocannon');
import autocannon from "autocannon";

const runTest = () => {
  const testload = autocannon({
    url: "http://localhost:4002/posts/new",
    connections: 100,
    duration: 30,
    requests: [
      {
        method: "POST",
        body: JSON.stringify({ userId: 123, token: "sample-token" }),
        headers: { "Content-Type": "application/json" },
      },
    ],
  });

  autocannon.track(testload);
};

runTest();
