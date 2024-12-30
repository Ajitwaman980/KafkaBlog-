// test-load.js
// const autocannon = require('autocannon');
import autocannon from "autocannon";

const runTest = () => {
  const instance = autocannon({
    url: "http://localhost:4001/login", // replace with the HTTP URL of your backend
    connections: 100, // Number of concurrent connections
    duration: 30, // Duration of the test in seconds
    requests: [
      {
        method: "POST",
        body: JSON.stringify({ userId: 123, token: "sample-token" }),
        headers: { "Content-Type": "application/json" },
      },
    ],
  });

  autocannon.track(instance);
};

runTest();
