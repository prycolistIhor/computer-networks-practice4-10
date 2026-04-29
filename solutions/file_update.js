const http = require("http");
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "data.json");

const readDataFile = (callback) => {
    fs.readFile(FILE_PATH, "utf8", (err, data) => {
        if (err) {
            return callback(err);
        }
        try {
            const parsedData = JSON.parse(data);
            callback(null, parsedData);
        } catch (err) {
            callback(new Error("Invalid JSON format"));
        }
    });
};

const server = http.createServer((req, res) => {
    const urlParts = req.url.split('/');
    const id = parseInt(urlParts[2], 10);

    if (req.method === "PUT" && urlParts[1] === "data" && id) {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            if (!body) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Missing body" }));
            }

            let updatedData;
            try {
                updatedData = JSON.parse(body);
            } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Invalid JSON format" }));
            }

            readDataFile((err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Failed to read data.json" }));
                }

                const itemIndex = data.findIndex(item => item.id === id);

                if (itemIndex === -1) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Object with the given ID not found" }));
                }

                data[itemIndex] = { ...data[itemIndex], ...updatedData };

                fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2), (err) => {
                    if (err) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: "Failed to write to file" }));
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: "Data updated successfully" }));
                });
            });
        });
    } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: "Not Found" }));
    }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
