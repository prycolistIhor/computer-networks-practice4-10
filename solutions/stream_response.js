const http = require("http");
const fs = require("fs");
const url = require("url");

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === "/file" && req.method === "GET") {
        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.statusCode = 400;
            res.end("fileName query parameter is required");
            return;
        }

        fs.access(fileName, fs.constants.F_OK, (err) => {
            if (err) {
                res.statusCode = 400;
                res.end("File does not exist");
                return;
            }

            res.statusCode = 200;
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            const fileStream = fs.createReadStream(fileName);
            fileStream.pipe(res);

            fileStream.on("error", (err) => {
                res.statusCode = 500;
                res.end("Error reading file");
            });
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
