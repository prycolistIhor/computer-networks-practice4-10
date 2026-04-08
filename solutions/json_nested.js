const http = require("http");

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === "POST" && req.url === "/json-nested") {
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

            const { user } = parsed;

            if (!user) {
                res.writeHead(422);
                return res.end("Missing user");
            }

            const { name, roles } = user;

            if (roles === undefined) {
                res.writeHead(422);
                return res.end("Missing roles");
            }

            if (!Array.isArray(roles)) {
                res.writeHead(422);
                return res.end("roles must be an array");
            }

            const response = {
                name: name,
                roleCount: roles.length,
                isAdmin: roles.includes("admin")
            };

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
