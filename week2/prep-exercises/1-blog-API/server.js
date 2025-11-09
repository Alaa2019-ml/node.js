const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//handle errors
const handleError = (res, statusCode, msg) => {
  return res.status(statusCode).json({ msg: msg });
};

//create a blog
app.post("/blogs", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  if (!title || !content) {
    return handleError(res, 400, "Missing data.");
  }

  fs.writeFileSync(title, content);
  res.end("ok");
});

//update a blog
app.put("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const content = req.body.content;

  if (!fs.existsSync(title)) {
    return handleError(res, 404, "File not found");
  }

  if (!content) return handleError(res, 400, "Missing data.");
  fs.writeFileSync(title, content);
  res.end("ok");
});

//delete a blog
app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;

  if (!fs.existsSync(title)) {
    return handleError(res, 404, "File not found");
  }

  fs.unlinkSync(title);
  res.end("ok");
});

//read a blog
app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;
  // check if post exists
  if (!fs.existsSync(title)) {
    return handleError(res, 404, "File not found");
  }
  // send response
  const post = fs.readFileSync(title);
  res.status(200).send(post);
});

//read all blogs
app.get("/blogs", (req, res) => {
  const files = fs.readdirSync(__dirname);
  const blogs = files
    .map((file) => {
      const filename = path.join(__dirname, file);
      const stats = fs.lstatSync(filename);
      if (stats.isFile() && !path.extname(filename)) {
        return { title: file };
      }
    })
    .filter(Boolean);
  res.status(200).json(blogs);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
