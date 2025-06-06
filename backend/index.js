require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
//mongoose.connect(config.connectionString)

mongoose.connect(process.env.CONFIG)

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
        return res.status(400).json({ error: true, message: "Invalid Credetials" })
    }
});


// Get User

app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(501);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        },
        message: ""
    })
});

// Get All Notes

app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully."
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
})



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

// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res
            .status(400)
            .json({ error: true, message: "No changes provided" })
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully"
        })
    }
    catch (err) {
        return res.status(500)
            .json({
                error: true,
                message: "Internal server error"
            })
    }
})

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note)
            return res.status(404).json({ error: true, message: "Note not found" })

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            note,
            message: "Note deleted successfully",
        })
    }
    catch (err) {
        return res.status(500)
            .json({
                error: true,
                message: "Internal Server Error"
            })
    }
})

//Update is Pinned 
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;


    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note)
            return res.status(404).json({
                error: true, message: "Note not found"
            });

        note.isPinned = !isPinned;
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note pinned updated successfully"
        })
    }
    catch (err) {
        return res.status(500)
            .json({
                error: true,
                message: "Internal server error"
            })
    }
})

// Search Note

app.get("/search-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({
            error: true,
            message: "Please provide a query to search"
        })
    }
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ],
        })

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Matching Notes found successfully"
        })
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        })
    }
})


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app