const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const PORT = 3000;

const initializeServer = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mongoDemoDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Default route to display login form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/search.html');
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/login.html');
// });

app.get('/allusers', async (req, res) => {
    try {
        const allUsers = await User.find({});
        res.json(allUsers);
    } catch (err) {
        res.status(500).send('Error fetching all users.');
    }
});

app.post('/search', async (req, res) => {
    try {
        console.log("Received search payload:", req.body);
        let queryObject;

        // Try parsing the input as JSON
        try {
            queryObject = JSON.parse(req.body.username);
        } catch (error) {
            // If parsing fails, treat the input as a plain string
            queryObject = req.body.username;
        }

        const query = { username: queryObject };

        console.log("Constructed query for MongoDB:", query);

        const users = await User.find(query);
        console.log("Search results:", users);
        res.json(users);
    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).send('Server error');
    }
});

app.post('/login', async (req, res) => {
    try {
        console.log("Attempting to find user with credentials:", req.body);  // Log the received credentials
        const user = await User.findOne({ username: req.body.username, password: req.body.password });
        if (user) {
            console.log("Found user:", user); 
            res.send('Logged in successfully!');
        } else {
            console.log("No user found for given credentials.");  
            res.send('Invalid credentials!');
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).send('Server error');
    }
});

// Call the function to initialize the server
initializeServer();
