const jwt = require("jsonwebtoken");

const authJwt = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        return res.status(401).json({
            success: false,
            err: "No Token Sent"
        });
    }
    try {
        const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.id = payload.id;
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({
            success: false,
            err: "Invalid Token"
        })
    }
    next();
}

module.exports = authJwt;