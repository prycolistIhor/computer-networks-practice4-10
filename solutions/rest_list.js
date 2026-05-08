const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/items" && req.method === "GET") {
        const filePath = path.join(__dirname, "data.json");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error reading data");
                return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(data);
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
