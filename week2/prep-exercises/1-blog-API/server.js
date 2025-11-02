const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
app.use(express.json());

//create a blog
app.post("/blogs", (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  if (!title || !content) {
    return res.status(400).json({ msg: "Missing data." });
  }
  fs.writeFileSync(title, content);
  res.end("ok");
});

//update a blog
app.put("/blogs/:title", (req, res) => {
  const title = req.params.title;
  const content = req.body.content;

  if (fs.existsSync(title)) {
    if (!content) {
      return res.status(400).json({ msg: "Missing data." });
    }
    fs.writeFileSync(title, content);
    res.end("ok");
  } else {
    // Send response with error message
    res.status(404).json({ msg: "File not found" });
  }
});

//delete a blog
app.delete("/blogs/:title", (req, res) => {
  const title = req.params.title;
  // How to get the title from the url parameters?
  if (fs.existsSync(title)) {
    // Add condition here
    fs.unlinkSync(title);
    res.end("ok");
  } else {
    res.status(404).json({ msg: "File not found" });
    // Respond with message here
  }
});

//read a blog
app.get("/blogs/:title", (req, res) => {
  const title = req.params.title;
  // How to get the title from the url parameters?
  // check if post exists
  if (!fs.existsSync(title)) {
    return res.status(404).json({ msg: "File not found" });
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
