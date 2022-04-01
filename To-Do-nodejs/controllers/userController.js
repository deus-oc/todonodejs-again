const {UserModel} = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addUser = async (req, res) => {
    const {email, password} = req.body;

    if (email === undefined || password === undefined) {
        return res.status(400).json({
            success: false,
            err: "User/Email not sent"
        })
    }

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModel({email: email, password: hashedPassword});
        newUser.save((err, user) => {
            if (err) {
                console.error(err.message);
                return res.status(400).json({
                    "success": false,
                    "err": "Email already registered"
                });
            }
            return res.status(201).json({
                "success": true,
                "data": {
                    id: user._id
                }
            });
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            err: err.message
        })
    }
}

const loginUser = (req, res) => {
    const {email, password} = req.body;
    if (password === undefined || email === undefined) {
        res.status(400).json({
            success: false,
            err: "User/Email not sent"
        })
    }
    try {
        UserModel.findOne({email: email}, async (err, user) => {
            if (err) {
                console.error(err)
                return res.status(401).json({
                    success: false,
                    err: "Wrong email/password credentials"
                })
            }
            if (!user) {
                return res.status(403).json({
                    success: false,
                    err: "Not registered"
                })
            }
            // check the password is correct or not
            const same = await bcrypt.compare(password, user.password)
            if (!same) {
                return res.status(401).json({
                    success: false,
                    err: "Wrong Password"
                })
            }
            // generate the jwt
            const accessToken = jwt.sign({
                id: user._id,
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
            const refreshToken = jwt.sign({
                id: user._id,
                email: email
            }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '30m'})

            res.status(200).json({
                success: true,
                data: {
                    email: email,
                    token: accessToken,
                    refreshToken: refreshToken,
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            err: "Internal Server Error",
        })
    }

}

const verifyRefresh = async (req, res) => {
    const {email, refreshToken} = req.body;
    if (!email || !refreshToken) {
        return res.status(400).json({
            success: false,
            err: "data empty"
        })
    }
    try {
        const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (payload.email !== email) {
            return res.status(401).json({
                success: false,
                error: "Invalid refresh token"
            });
        }
        const accessToken = await jwt.sign({id: payload.id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "10m",
        });
        return res.status(200).json({
            success: true,
            data: {
                email: email,
                token: accessToken
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            err: "Invalid refresh token"
        });
    }
}

module.exports = {addUser, loginUser, verifyRefresh}