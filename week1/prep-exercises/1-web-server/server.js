/**
 * Exercise 3: Create an HTTP web server
 */

const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const port = process.env.PORT || 3001;

const readFile = async (fileName, type, res) => {
  const output = await fs.readFile(path.join(__dirname, fileName));
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  res.end(output);
};

const handleError = (res, statusCode, msg) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "text/plain");
  res.end(msg);
};
//create a server
let server = http.createServer(async (req, res) => {
  console.log("Requested url: ", req.url);

  try {
    if (req.method !== "GET") {
      return handleError(res, 405, "Method not allowed");
    }

    if (req.url === "/") {
      return await readFile("index.html", "text/html", res);
    }

    if (req.url === "/index.js") {
      return await readFile("index.js", "text/javascript", res);
    }

    if (req.url === "/style.css") {
      return await readFile("style.css", "text/css", res);
    }

    handleError(res, 404, "File Not found!");
  } catch (err) {
    handleError(res, 500, "Internal server error");
  }
});

// server.listen(3000); // The server starts to listen on port 3000
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
