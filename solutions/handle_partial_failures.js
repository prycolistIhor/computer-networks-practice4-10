const http = require("http");
const fs = require("fs");
const path = require("path");

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const server = http.createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/error-handling") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", async () => {
            try {
                const files = JSON.parse(body);

                if (!Array.isArray(files)) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(
                        JSON.stringify({ error: "Request body must be an array" }),
                    );
                }

                const results = await Promise.allSettled(
                    files.map((file) => {
                        return readFile(path.join(__dirname, file));
                    }),
                );

                const successes = [];
                const failures = [];

                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        successes.push({ file: files[index], content: result.value });
                    } else {
                        failures.push({ file: files[index], error: result.reason.message });
                    }
                });

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(
                    JSON.stringify({
                        successes,
                        failures,
                        total: files.length,
                    }),
                );
            } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Malformed JSON in request body" }));
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
