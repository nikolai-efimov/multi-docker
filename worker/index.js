const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const subscription = redisClient.duplicate();

function fib(index) {
    // this function is not ideal because it's slow
    // but is good for illustrating why a worker
    // process might be needed
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

subscription.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
});

subscription.subscribe('insert');
