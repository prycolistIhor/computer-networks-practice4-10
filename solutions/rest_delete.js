const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const match = req.url.match(/^\/items\/(\d+)$/);

    if (match && req.method === "DELETE") {
        const id = Number(match[1]);
        const filePath = path.join(__dirname, "data.json");

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error reading data");
                return;
            }

            const items = JSON.parse(data);
            const index = items.findIndex((item) => item.id === id);

            if (index === -1) {
                res.statusCode = 404;
                res.end("Item not found");
                return;
            }

            items.splice(index, 1);

            fs.writeFile(
                filePath,
                JSON.stringify(items, null, 2),
                (err) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end("Error writing data");
                        return;
                    }

                    res.statusCode = 200;
                    res.end("Item deleted");
                }
            );
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});
