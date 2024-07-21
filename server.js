const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware
app.use(express.static('website'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Data storage
let projectData = {};

// POST route to receive data from client
app.post('/add', (req, res) => {
    const newData = req.body;
    projectData = { ...newData };
    console.log('Received new data:', projectData);
    res.status(200).send({ message: 'Data received successfully!' });
});

// GET route to send projectData to client
app.get('/get', (req, res) => {
    res.send(projectData);
});

// Server listening
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
