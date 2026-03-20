const http = require("http");
const { URL } = require("url");

const port = process.argv[2];

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && parsedUrl.pathname === "/sum") {
        const aRaw = parsedUrl.searchParams.get("a");
        const bRaw = parsedUrl.searchParams.get("b");

        const a = Number(aRaw);
        const b = Number(bRaw);

        if (aRaw === null || bRaw === null || Number.isNaN(a) || Number.isNaN(b)) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ error: "Invalid numbers" }));
        }

        const sum = a + b;

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ sum }));
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
