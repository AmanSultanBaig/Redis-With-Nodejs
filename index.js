const express = require("express");
const redis = require("redis");
const axios = require("axios");
const cors = require("cors")
require("dotenv").config();

const EXPIRATION_TIME = 3600;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors())

let redisClient;
let results; 

(async () => {
    redisClient = redis.createClient();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));

    await redisClient.connect();
})();

let port = process.env.PORT || 3000;

app.get('/photos', async (req, res) => {
    try {
        const cacheResults = await redisClient.get("photos");
        if (cacheResults) {
            results = JSON.parse(cacheResults);
        } else {
            const { data } = await axios.get(`${process.env.BASE_URL}/photos`);
            results = data;
            redisClient.setEx("photos", EXPIRATION_TIME, JSON.stringify(data))
        }
        res.send(results)
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => console.log(`App is running on http://localhost:${port} `))