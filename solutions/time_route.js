const http = require("http");

const port = process.argv[2];

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/time") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ now: new Date().toISOString() }));
  } else {
    res.statusCode = 404;
    res.end();
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
