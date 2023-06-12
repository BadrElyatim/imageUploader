var express = require('express');
var formidable = require('formidable');
var cors = require("cors")
var uuid = require("uuid")
var path = require("path")

var app = express();

app.use(cors())
app.use(express.static('./uploads'))

app.get('/api/image/:id', function (req, res){
    res.sendFile(__dirname + "/uploads/" + req.params.id)
});

app.post('/api', function (req, res){
    var form = new formidable.IncomingForm({
        keepExtensions: true,

    });

    form.parse(req, (err, fields, files) => {
        if (err) {
          console.log(err)
          res.status(400).send("error")
        }
    });


    form.on('fileBegin', function (name, file){
        file.filepath = __dirname + '/uploads/' + uuid.v1() + path.extname(file.newFilename)
    });

    form.on('file', function (name, file){
        res.status(200).setHeader('content-type', 'image/' + path.extname(file.newFilename).slice(1))
        res.end(path.basename(file.filepath))
    });


});

app.listen(3000, () => console.log("server on"));