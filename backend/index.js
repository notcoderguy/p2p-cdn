const express = require('express');
const mongooose = require('mongoose');
const redis = require('ioredis');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const db = process.env.DATABASE_URL;
const cache = process.env.REDIS_URL;

mongooose.connect(db)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const redisClient = new redis(cache);
redisClient.on('connect', () => {
    console.log('Redis connected...');
});

// Redis cache mmdb file
const Reader = require('@maxmind/geoip2-node').Reader;
redisClient.set('mmdb', fs.readFileSync('./GeoLite2-City.mmdb'))
    .then(() => console.log('mmdb file loaded in redis...'))
    .catch(err => console.log(err));

try {
    const reader = Reader.openBuffer(redisClient.get('mmdb'));
    console.log(reader.city('1.1.1.1'));
} catch (err) {
    console.log(err);
}


app.use(express.json());

app.get('/', (req, res) => {
    json_content = {
        "name": "P2P-CDN",
        "version": "1.0.0",
        "description": "P2P CDN is a distributed content delivery system where multiple users or devices share and deliver content, reducing scalability, cost, and single point of failure issues. Our solution spreads the load and storage across multiple users/devices, improving scalability, reliability, and reducing costs. It reduces bandwidth and content storage costs, and the load on the origin server. Our solution serves content as fast as any edge server and is designed for optimal performance.",
        "contributors": [
            {
                "name": "Vasu Grover",
                "regid": "RA1911003030248"
            },
            {
                "name": "Pranjal Tyagi",
                "regid": "RA1911003030249"
            },
            {
                "name": "Naman Kumar",
                "regid": "RA1911003030256"
            },
            {
                "name": "Aniket Sharma",
                "regid": "RA1911003030436"
            }
        ],
        "github": "https://github.com/notcoderguy/p2p-cdn",
    }
    res.json(json_content);
});

app.use('/users', require('./routes/user'));

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});