const http = require("http");
const crypto = require("crypto");

const heavyAsyncTask = (index) => {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(
            "password",
            "salt",
            100000,
            64,
            "sha512",
            (err, derivedKey) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`Task ${index} completed`);
                }
            },
        );
    });
};

const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/threadpool-limit") {
        const startTime = Date.now();

        try {
            const tasks = [];
            for (let i = 0; i < 8; i++) {
                tasks.push(heavyAsyncTask(i + 1));
            }

            await Promise.all(tasks);

            const durationMs = Date.now() - startTime;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    tasks: 8,
                    durationMs: durationMs,
                }),
            );
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error during execution" }));
        }
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not Found" }));
    }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
