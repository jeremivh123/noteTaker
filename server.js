var express = require("express");
var fs = require('fs');
var app = express();

app.use(express.static('public'));
var PORT = process.env.PORT || 3000;

app.get('/notes', function (req, res) {
    res.sendFile(__dirname + '/public/notes.html');
});

app.get('/api/notes', function(req, res) {
    // sending the json file back to the client
    res.json(JSON.parse(fs.readFileSync(__dirname + '/db/db.json')));
});

app.get('*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

app.post('/api/notes', function(req, res){
    var newNote = {
        title: req.body.title,
        text: req.body.text,
    };

    var notes = (JSON.parse(fs.readFileSync(__dirname + '/db/db.json')));

    // notes : read from the file JSON.parse
    newNote.id = getRandomString(5);
    notes.push(newNote);
    // push the newNote
    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes));
    // rewrite to the file : JSON.stringify()
    res.json(notes);
    // send the json back to the client res.json()

});


// http://localhost:30000/api/notes/0

app.delete('/api/notes/:id', function(req, res){
    var noteId = req.params.id;

    var notes = (JSON.parse(fs.readFileSync(__dirname + '/db/db.json')));
    notes = notes.filter(function(note) {
        if (note.id == noteId) {
            return false;
        }

        return true;
    });

    // write the notes to the file
    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes));
    // send it back as json res.json()
    res.json(notes);
});


app.listen(PORT, function(){
    console.log("Server listening on PORT " + PORT);
});
