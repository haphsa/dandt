var express = require('express');
var THREE = require('three');
var app = express();
var path=require('path');
// Set EJS as the view engine
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'views')));
// Serve the index.ejs file at the root path
app.get("/views", (req, res) => {
    
  });
app.get('/', function (req, res) {
  // If your index.ejs file is in a different directory, use the full path
  res.render('index');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});