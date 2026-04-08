const http = require("http");

const port = process.argv[2];

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/json-calc") {
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

            const { a, b, operation } = parsed;

            if (a === undefined || b === undefined || !operation) {
                res.writeHead(422);
                return res.end("Missing fields");
            }

            if (typeof a !== "number" || typeof b !== "number") {
                res.writeHead(422);
                return res.end("a and b must be numbers");
            }

            let result;

            switch (operation) {
                case "add":
                    result = a + b;
                    break;
                case "subtract":
                    result = a - b;
                    break;
                case "multiply":
                    result = a * b;
                    break;
                case "divide":
                    if (b === 0) {
                        res.writeHead(400);
                        return res.end("Division by zero");
                    }
                    result = a / b;
                    break;
                default:
                    res.writeHead(400);
                    return res.end("Invalid operation");
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({ result }));
        });

    } else {
        res.writeHead(404);
        return res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
