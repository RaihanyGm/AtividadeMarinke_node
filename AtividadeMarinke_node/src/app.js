var express = require('express');
var cors = require('cors');
var path = require('path');
var rotasTarefa = require('./routes/rotasTarefa');
var app = express();

app.use(cors());

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/tarefa', rotasTarefa);

module.exports = app;
