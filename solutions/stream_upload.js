const http = require("http");
const fs = require("fs");

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/upload") {
        const fileStream = fs.createWriteStream("upload.txt");

        req.pipe(fileStream);

        fileStream.on("finish", () => {
            res.statusCode = 200;
            res.end("File uploaded successfully");
        });

        req.on("error", () => {
            res.statusCode = 500;
            res.end("Request error");
        });

        fileStream.on("error", () => {
            res.statusCode = 500;
            res.end("File write error");
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
