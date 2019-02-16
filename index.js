const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
var fs = require('fs');
//var files = fs.readdirSync('css');
const app = express();
const port = 3000;
app.use(cors());
//Routes
const files = require('./routes/files');
app.use('/files', files);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start Server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});