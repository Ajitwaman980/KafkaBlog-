// test-load.js
import autocannon from "autocannon";

const runTest = () => {
  const test = autocannon({
    url: "http://localhost:4002/posts/new",
    method: "POST",
    connections: 100, // 100 concurrent connections
    duration: 30, // run for 30 seconds
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MTBkOTc0ZDIxNTY5ZDFhMDYzYzc1MyIsInVzZXJuYW1lIjoiYWppdF93YW1hbiIsImVtYWlsIjoiYWppdEBleGFtcGxlLmNvbSIsImlhdCI6MTc0NTk1MjA0Nn0.NaNLDZvYnwoaG1eWp4eEZ8m6t3XsvtPivhI1uV8ro0Q",
    },
    body: JSON.stringify({
      title: "Load Test Post",
      content: "This is test content from autocannon",
      category: "Tech",
    }),
  });

  autocannon.track(test, { renderProgressBar: true });
};

runTest();
