const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public/')));

const dataFilePath = path.join(__dirname, 'data', 'names.json');

// Ensure names.json exists
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]');
}

// API to fetch names data
app.get('/api/names', (req, res) => {
    const names = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json(names);
});

// API to add a name
app.post('/api/names', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send('Name is required');
    }
    const names = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const standardizedName = name[0].toUpperCase() + name.slice(1).toLowerCase();
    names.push(standardizedName);
    fs.writeFileSync(dataFilePath, JSON.stringify(names, null, 2));
    res.json({ message: 'Name added successfully', names });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
