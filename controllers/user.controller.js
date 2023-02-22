const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require("../models");
const User = db.users;
const Content = db.content;

// Create and Save a new User

exports.createUser = async (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
    })
    try {
        const emailExist = await User.findOne({
            where: {
              email: req.body.email,
            },
          });
        if (emailExist) {
            res.status(404).json({ msg: "User already exist" })
        }
        const token = jwt.sign({ id: newUser._id }, "JWTSECRET", {
            expiresIn: "24h",
        });
        if (!token) throw Error("Couldnt sign the token");
        await newUser.save();
        res.status(200).json({ newUser, token });
    }
    catch (error) {
        res.status(400).json({ error: error })
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!(email, password)) {
        res.status(400).json({ message: "All input is required" });
    }
    try {
        const user = await User.findOne({
            where: {
              email: email,
            },
          });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                "JWTSECRET",
                {
                    expiresIn: "24h",
                }
            );
            user.token = token;
            res.status(200).json({ user: user, message: "Login Successfully" });
        } else {
            res.status(401).json({ message: "Invalid Credentials" })
        }
    } catch (error) {
        res.status(400).json({ message: error })
    }
}

exports.content = async (req, res) => {
    const data = new Content({
        content: req.body.content,
    })
    try {
        await data.save();
        res.status(200).json({ content: data, message: "Content Save Successfully" });
    }
    catch (error){
        res.status(400).json({ message: error })
    }
}

exports.getContent = async (req, res) => {
    const user = await Content.findAll({});
    try {
        res.status(200).json({ content: user, message: "Content Get Successfully" });
    }
    catch (error){
        res.status(400).json({ message: error })
    }
}

