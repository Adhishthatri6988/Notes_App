import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const identifier = req.ip || req.headers["x-forwarded-for"] || "anonymous";
    const { success, reset } = await ratelimit.limit(identifier);

    if (!success) {
      return res
        .status(429)
        .set("Retry-After", `${Math.ceil((reset - Date.now()) / 1000)}`)
        .json({
          message: "Too many requests, please try again later",
        });
    }

    next();
  } catch (error) {
    console.error("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
