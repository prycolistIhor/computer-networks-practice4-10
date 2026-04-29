const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2];

const FILE_PATH = path.join(__dirname, "data.json");

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/data") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            if (!body) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Missing body" }));
            }

            try {
                const parsedData = JSON.parse(body);

                fs.writeFile(FILE_PATH, JSON.stringify(parsedData, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(
                            JSON.stringify({ error: "Failed to write to file" }),
                        );
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(
                        JSON.stringify({ message: "Data saved successfully" }),
                    );
                });
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
