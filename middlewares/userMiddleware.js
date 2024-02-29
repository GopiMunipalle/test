const dotEnv = require("dotenv");
const jwt = require("jsonwebtoken");
dotEnv.config();
let SECRET_KEY = process.env.SECRET_KEY;

const middleware = (req, res, next) => {
  try {
    const authHeaders = req.headers["authorization"];
    console.log(authHeaders);
    if (!authHeaders) {
      return res.status(400).send({ error: "Token is Required" });
    }
    let jwtToken = authHeaders.split(" ")[1];
    console.log(jwtToken);
    if (!jwtToken) {
      return res.status(400).send({ error: "Token not found" });
    }
    jwt.verify(jwtToken, SECRET_KEY, (error, payload) => {
      if (error) {
        console.log(error);
        return res.status(400).send({ error: "Invalid Token" });
      }
      req.email = payload.email;
      console.log(req.email);
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.middleware = middleware;
