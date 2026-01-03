const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const Redis = require("ioredis");

// Single Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
});

// Helper to create RedisStore instances
const createRedisStore = () =>
  new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  });

// 🌍 Public routes (IP-based)
const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.ip,
  store: createRedisStore(),
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔓 Auth routes (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.ip,
  store: createRedisStore(),
  standardHeaders: true,
  legacyHeaders: false,
});

// 👤 User routes (user-based)
const userLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => (req.user && (req.user.userId || req.user.id)) || req.ip,
  store: createRedisStore(),
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  publicLimiter,
  authLimiter,
  userLimiter,
};
