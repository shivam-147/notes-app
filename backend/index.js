require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
mongoose.connect(config.connectionString)
const User = require("./models/user.model")
const Note = require("./models/note.model")

const express = require("express")
const cors = require("cors")
const app = express();
const { authenticateToken } = require("./utilities")

app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
)

app.get('/', (req, res) => {
    res.json({ data: "hello hii" })
})

// Create account

app.post("/create-account", async (req, res) => {

    const { fullName, email, password } = req.body;
    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Full Name is require" })
    }
    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" })
    }
    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is require" })
    }

    const isUser = await User.findOne({ email: email })
    if (isUser) {
        return res.json({
            error: true,
            message: "user already exist"
        })
    }

    const user = new User({
        fullName,
        email,
        password
    })

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful"
    })
})

// Login

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is require"
        })
    }
    if (!password) {
        return res.status(400).json({
            message: "Password is require"
        })
    }
    const userInfo = await User.findOne({ email: email })

    if (!userInfo) {
        return res.status(400).json({ error: true, message: "user not found" })
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken
        })
    }
    else {
        return res.status(400).json({ error: true, message: "Invalid Email or Password" })
    }
});

// Add Note

app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res
            .status(400)
            .json("Title is required");
    }
    if (!content) {
        return res
            .status(400)
            .json("Content is required")
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id
        })

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        })
    }
    catch (err) {
        return res.status(500)
            .json({
                error: true,
                message: "Failed to add note",
            })
    }
})

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});


module.exports = app