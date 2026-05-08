const http = require("http");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
        res.statusCode = 200;
        res.end("OK");
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
