const http = require("http");

const port = process.argv[2];

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/json-array") {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            if (!body) {
                res.writeHead(400);
                return res.end("Missing body");
            }

            let parsed;

            try {
                parsed = JSON.parse(body);
            } catch (err) {
                res.writeHead(400);
                return res.end("Invalid JSON");
            }

            const { numbers } = parsed;

            if (!Array.isArray(numbers)) {
                res.writeHead(422);
                return res.end("numbers must be an array");
            }

            for (let n of numbers) {
                if (typeof n !== "number") {
                    res.writeHead(422);
                    return res.end("All values must be numbers");
                }
            }

            if (numbers.length === 0) {
                const response = {
                    count: 0,
                    sum: 0,
                    average: 0
                };

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                return res.end(JSON.stringify(response));
            }

            const count = numbers.length;
            const sum = numbers.reduce((acc, n) => acc + n, 0);
            const average = sum / count;

            const response = { count, sum, average };

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify(response));
        });

    } else {
        res.writeHead(404);
        return res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
