const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2];

const FILE_PATH = path.join(__dirname, "data.json");

const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/data") {
        fs.readFile(FILE_PATH, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(
                    JSON.stringify({ error: "File not found or unable to read" }),
                );
            }

            try {
                const parsedData = JSON.parse(data);

                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify(parsedData));
            } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Not Found" }));
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
