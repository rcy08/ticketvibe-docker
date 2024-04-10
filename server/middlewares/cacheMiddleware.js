const cache = require('memory-cache');

// Custom middleware for caching
const cacheMiddleware = (duration) => {
    return (req, res, next) => {
        
      const key = `__express__${req.originalUrl || req.url}`;
      const cachedBody = cache.get(key);
  
      if (cachedBody) {
        res.send(cachedBody);
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          cache.put(key, body, duration * 1000);
          res.sendResponse(body);
        };
        next();
      }

    };
};

module.exports = cacheMiddleware;