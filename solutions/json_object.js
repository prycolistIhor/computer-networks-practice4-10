const http = require("http");

const port = process.argv[2];

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/json-object") {
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

                const { name, age } = parsed;

                if (!name) {
                    res.writeHead(422);
                    return res.end("Missing name");
                }

                if (age === undefined) {
                    res.writeHead(422);
                    return res.end("Missing age");
                }

                if( typeof age != "number")
                {
                    res.writeHead(422);
                    return res.end("Age must be number");
                }

                const response = {
                    greeting: `Hello ${name}`,
                    isAdult: age >= 18 ? true : false,
                };

                res.writeHead(200, {
                    "Content-Type": "application/json",
                });
                res.end(JSON.stringify(response));
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
