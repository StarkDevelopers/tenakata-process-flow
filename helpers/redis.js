const redisClient = require('../services/redis');

const _get = function (key) {
    return new Promise((resolve, reject) => {
        if (!redisClient || !key) {
            return resolve(null);
        }
        return redisClient.get(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

const _getJSON = function (key) {
    return new Promise((resolve, reject) => {
        if (!redisClient || !key) {
            return resolve(null);
        }
        return redisClient.get(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            //Convert the result to JSON Object
            if (reply !== null && typeof reply === 'string') {
                try {
                    reply = JSON.parse(reply);
                } catch (exception) {
                    reply = null;
                }
            }
            return resolve(reply);
        });
    });
}

const _set = function (key, value, ttl) {
    return new Promise((resolve, reject) => {
        if (!redisClient || !key) {
            return resolve(null);
        }
        // default:- one day (in seconds)
        if (!ttl) {
            ttl = 86400;
        }

        return redisClient.set(key, value, 'EX', ttl, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

const _setJSON = function (key, value, ttl) {
    return new Promise((resolve, reject) => {
        if (!redisClient || !key) {
            return resolve(null);
        }
        // default:- one day (in seconds)
        if (!ttl) {
            ttl = 86400;
        }
        // Stringify the result
        if (value !== null && typeof value === 'object')
            value = JSON.stringify(value);
        return redisClient.set(key, value, 'EX', ttl, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

const _unlink = function (keys) {
    return new Promise((resolve, reject) => {
        if (!redisClient || keys === null) {
            return resolve(0);
        }
        // replace it to unlink(non-blocking) once we upgrade to redis 4.x
        return redisClient.del(keys, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

const _unlinkByPattern = function (pattern) {
    return new Promise((resolve, reject) => {
        if (!redisClient || pattern === null) {
            return resolve(0);
        }
        let matchingKeys = [];
        function scan(cursor, pattern) {
            redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 10, (err, res) => {
                if (err) {
                    return reject(err);
                }
                matchingKeys = matchingKeys.concat(res[1]);
                if (res[0] === '0') {
                    if (matchingKeys.length > 0) {
                        return resolve(_unlink(matchingKeys));
                    } else {
                        return resolve(0);
                    }
                } else {
                    return scan(res[0], pattern)
                }
            });
        }
        return scan(0, pattern);
    });
}

/**
 * To find out the time to live for a redis key (in seconds)
 * @param {*} key
 */
const _ttl = function (key) {
    return new Promise((resolve, reject) => {
        redisClient.ttl(key, (err, reply) => {
            if (err) {
                return reject(err);
            }
            return resolve(reply);
        });
    });
}

module.exports = {
    get: _get,
    getJSON: _getJSON,
    set: _set,
    setJSON: _setJSON,
    ttl: _ttl,
    del: _unlink,
    delByPattern: _unlinkByPattern
}
