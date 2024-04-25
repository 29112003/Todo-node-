const { render, name } = require('ejs');
const express = require('express')
const app = express()
const fs = require('fs');

app.set('view engine','ejs')

app.use(express.json());
const path = require('path');
app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({ extended: true }));

app.get('/',function(req,res){
    var arr = [];
    fs.readdir('./files',function(err,files){
        files.forEach(function(file){
            var content = fs.readFileSync(`./files/${file}`,'UTF-8');
            const today = new Date();

const day = today.getDate();
const month = today.toLocaleString('default', { month: 'short' }).toUpperCase();
const year = today.getFullYear();

const formattedDate = `${day} ${month} ${year}`;

            arr.push({name : file,content : content,date:formattedDate});
        })
        res.render("index",{arr});
    })
})
app.post('/create',function(req,res){
    var filename = req.body.file.split(' ').join('') + ".txt"; 
    fs.writeFile(`./files/${filename}`,req.body.content,function(error){
        if(error)res.status(500).send("marrgayi");
        else res.redirect('/')
    })
})
app.post('/update', function(req, res) {
    let file = req.body.filename;
    let content = req.body.content;
    console.log(file,content);
    fs.writeFile(`./files/${file}`,`${content}`,function(err){
        if(err) return res.status(404).send(err);
        else res.redirect('/')
    })
});
app.get("/read/:filename",function(req,res){
    var filename = req.params.filename;
    var details;
    var obj = {};
    fs.readFile(`./files/${filename}`, "UTF-8", function(err, data) {
        if (err) {
            return res.status(500).send(err);
        } else {
            var details = data; 
            var obj = { name: filename, content: details }; 
            res.render("read",{obj});
        }
    });
})
app.get("/delete/:filename", function(req, res) {
    var filename = req.params.filename;
    console.log(filename)
    fs.unlink(`./files/${filename}`, function(err) { 
        if (err) {
            console.error('Error deleting file:', err);
            res.status(500).send('Error deleting file: ' + err);
        } else {
            res.redirect('/');
        }
    });
});
app.get("/edit/:filename", function(req, res) {
    var file = req.params.filename;
    var content;
    content = fs.readFileSync(`./files/${file}`,"utf-8");
        res.render("edit",{file,content})
});
app.listen(3000)