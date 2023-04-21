import React from 'react'
import { Reader } from '@maxmind/geoip2-node';
import { Redis } from 'ioredis';

const getMMDB = (ip) => {
    // Cache the database in redis
    const redis = new Redis()
    if (redis.get('mmdb') === null) {
        // Get the database from the file system
        const fs = require('fs')
        const path = require('path')
        const mmdb = fs.readFileSync(path.join(__dirname, '../GeoLite2-City.mmdb'))
        redis.set('mmdb', mmdb)
    }

    // Get the city and country from the database
    const lookup = new Reader(redis.get('mmdb'))
    const city = lookup.get(ip).city.names.en
    const country = lookup.get(ip).country.names.en
    console.log(city, country)

    // Return the city and country
    return (
        <div>
            <h1>{city}, {country}</h1>
        </div>
    )
}

export default getMMDB