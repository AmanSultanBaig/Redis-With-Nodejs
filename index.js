const express = require("express");
const app = express();

let port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Hello from Redis with node"))

app.listen(port, () => console.log(`App is running on http://localhost:${port} `))