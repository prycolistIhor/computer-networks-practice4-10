const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.url === "/items" && req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const newItem = JSON.parse(body);
                const filePath = path.join(__dirname, "data.json");

                fs.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end("Error reading data");
                        return;
                    }

                    const items = JSON.parse(data);
                    items.push(newItem);

                    fs.writeFile(
                        filePath,
                        JSON.stringify(items, null, 2),
                        (err) => {
                            if (err) {
                                res.statusCode = 500;
                                res.end("Error writing data");
                                return;
                            }

                            res.statusCode = 201;
                            res.setHeader("Content-Type", "application/json");
                            res.end(JSON.stringify(newItem));
                        }
                    );
                });
            } catch (error) {
                res.statusCode = 400;
                res.end("Invalid JSON");
            }
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
