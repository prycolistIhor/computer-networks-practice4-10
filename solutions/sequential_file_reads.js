const http = require("http");
const fs = require("fs");

const FILES = ["a.txt", "b.txt", "c.txt"];

const readFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.trim());
            }
        });
    });
};

const server = http.createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/sequential") {
        const startTime = Date.now();

        try {
            const aContent = await readFile(FILES[0]);
            const bContent = await readFile(FILES[1]);
            const cContent = await readFile(FILES[2]);

            const combined = aContent + bContent + cContent;
            const elapsedMs = Date.now() - startTime;

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ combined, elapsedMs }));
        } catch (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Error reading files" }));
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
