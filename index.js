const express = require("express");
const redis = require("redis");
const axios = require("axios");
const cors = require("cors")
require("dotenv").config();

const EXPIRATION_TIME = 3600;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors())

const redisClient = redis.createClient();

let port = process.env.PORT || 3000;

app.get('/photos', async (req, res) => {
    try {
        await redisClient.connect();
        const data = await redisClient.get('photos');
        if (data) {
            res.send(JSON.parse(data))
            await redisClient.disconnect();
        } else {
            const { data } = await axios.get(`${process.env.BASE_URL}/photos`);
            redisClient.setEx("photos", EXPIRATION_TIME, JSON.stringify(data))
            res.send(data)
        }
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => console.log(`App is running on http://localhost:${port} `))