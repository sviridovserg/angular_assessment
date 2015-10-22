'use strict';

var express = require('express');
var app = express();
var people= require('./people');
var path = require('path');
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.get('/api/person/:id', function (req, res) {
    res.send(people.get(req.params.id));
});

app.put('/api/person/:id', function (req, res) {
    var result = people.save(req.params.id, req.body);
    res.send(result, result.statusCode || 200);
});

app.listen(process.env.PORT || 8080, function () {
    console.info('The server is listening at port ' + (process.env.PORT || 8080));
});
