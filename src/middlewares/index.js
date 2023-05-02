require("dotenv").config();
const jwt = require("jsonwebtoken");
const {knex} = require("../service/instance");
const jwtSecret = process.env.JWT_SECRET;

async function validateToken(req, res, next) {
  const {authorization} = req.headers;
  try {
    const bearer = authorization.split(" ")[1];

    if (!authorization) return res.status(400).json({message: "Please log in"});

    const {id} = jwt.verify(bearer, jwtSecret);

    const user = await knex("users").where({id}).first();

    if (!user) return res.status(401).json({message: "Unauthorized user"});

    req.user = user;
    next();
  } catch (error) {
    res.status(404).json(error);
  }
}

module.exports = {validateToken};
