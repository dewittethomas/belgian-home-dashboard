import redis from 'redis';

let client;

async function init() {
    client = redis.createClient();
    await client.connect();
}

async function getData(key) {
    try {
        const data = await client.get(key);
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error getting data from cache: ${error}`);
        return null;
    }
}

async function setData(key, value, ttl=0) {
    try {
        await client.set(key, JSON.stringify(value), {
            EX: ttl
        });

    } catch (error) {
        console.error(`Error setting data in cache: ${error}`);
    }
}

export default {
    init,
    getData,
    setData
};
