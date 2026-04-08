const http = require("http");

const port = process.argv[2];

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/json-echo") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            if (!body) {
                res.writeHead(400);
                return res.end("Missing body");
            }

            try {
                const parsed = JSON.parse(body);

                res.writeHead(200, {
                    "Content-Type": "application/json",
                });

                res.end(JSON.stringify(parsed));
            } catch (err) {
                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
