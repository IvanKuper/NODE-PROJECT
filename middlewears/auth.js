const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //get the token
  const token = req.header("Authorization");

  //3.1
  if (!token) return res.status(401).send("Access Denied, no token provided.");

  //description the token and get payload

  try {
    const payload = jwt.verify(token, process.env.secretKey);
    req.payload = payload;

    next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
};
