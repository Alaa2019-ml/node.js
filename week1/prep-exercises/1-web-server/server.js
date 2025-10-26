/**
 * Exercise 3: Create an HTTP web server
 */

const http = require("http");
const fs = require("fs/promises");
const path = require("path");

//create a server
let server = http.createServer(async function (req, res) {
  console.log("Requested url: ", req.url);

  try {
    if (req.url === "/") {
      const html = await fs.readFile(path.join(__dirname, "index.html"));
      res.setHeader("Content-Type", "text/html");
      res.end(html);
    } else if (req.url === "/index.js") {
      const js = await fs.readFile(path.join(__dirname, "index.js"));
      res.setHeader("Content-Type", "text/javascript");
      res.end(js);
    } else if (req.url === "/style.css") {
      const css = await fs.readFile(path.join(__dirname, "style.css"));
      res.setHeader("Content-Type", "text/css");
      res.end(css);
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/plain");
      res.end("404 Not found!");
    }
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/plain");
    res.end("Internal server error");
  }
});

// server.listen(3000); // The server starts to listen on port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
