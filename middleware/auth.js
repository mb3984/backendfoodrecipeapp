const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(400).json({ message: "Invalid token" });
  }

  token = token.split(" ")[1]; // Extract token from "Bearer <token>"

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    console.log("Decoded Token:", decoded);
    req.user = decoded; // Attach user data to request
    next(); // Move to next middleware after successful verification
  });
};

module.exports = verifyToken;
