const express = require('express');
const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Retrieve from database
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) => 
        error ? console.error(error) : res.json(JSON.parse(data))
    );
});

// Save to database
app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        let db;
        error ? console.error(error) : db = JSON.parse(data);
        db.push(req.body);
        db.forEach((note) => (note.id = nanoid.nanoid()));
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => 
            err ? console.error(err) : console.log('Success!')
        );
    });
    res.send("Done!");
});

app.delete('/api/notes/:id', (req, res) => {
    id = req.params.id;
    fs.readFile('./db/db.json', 'utf8', (error, data) => {
        let db;
        error ? console.error(error) : db = JSON.parse(data);

        let index;
        for(let i = 0; i < db.length; i++){
            if(db[i].id === id)
                index = i;
        }

        db.splice(index,index+1);
        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => 
            err ? console.error(err) : console.log('Success!')
        );
    });
    res.send("Done!");
});

// Basic route that sends the user first to the AJAX Page
app.get('/assets/js/index.js', (req, res) => res.sendFile(path.join(__dirname, '../public/assets/js/index.js')));

app.get('/assets/css/styles.css', (req, res) => res.sendFile(path.join(__dirname, '../public/assets/css/styles.css')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '../public/notes.html')));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));