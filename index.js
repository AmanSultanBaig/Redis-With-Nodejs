const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

let port = process.env.PORT || 3000;

app.get('/photos', async (req, res) => {
    const { data } = await axios.get(`${process.env.BASE_URL}/photos`);
    res.send(data)
})

app.listen(port, () => console.log(`App is running on http://localhost:${port} `))