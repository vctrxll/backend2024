const {request, response} = require('express')
const jwt = require("jsonwebtoken");
require('dotenv').config();

const secret = process.env.SECRET;

const verifyToken = (req = request, res = response, next) => {
    const header = req.header("Authorization") || "";
    const token = header.split(" ")[1];

    if (!token) {
        return res.status(401).send("No token provided");
    }

    try {
        const payload = jwt.verify(token, secret)
        req.id = payload.id;
        req.isAdmin = payload.isAdmin;
        next();
    }catch(err) {
        return res.status(403).send({message: "Invalid token"});
    }

}

module.exports = verifyToken;