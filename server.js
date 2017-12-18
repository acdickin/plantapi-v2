var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var NodeCouchDB = require('node-couchdb');

const couch = new NodeCouchDB({
  auth:{
    user:'superman',
    password:'Cloudy88!'
  }
});

const plantdb='plants'
const viewUrl='_design/all_plants/_view/all'

// couch.listDatabases().then((dbs)=>{
//   console.log(dbs);
// })
var app = express();
var Promises= require('bluebird');

const PORT =3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req,res)=>{
  res.render('index');
})

app.get('/plants', (req,res)=>{
  couch.get(plantdb,viewUrl).then(
    (data, header, status)=>{
        console.log(data.data.rows);
        res.render('plants',{
          plants:data.data.rows
        })
    },
    (err)=>{
       res.send(err)
    })
})

app.post('/plant/add',(req,res)=>{
  couch.uniqid().then((ids)=>{
    const id =ids[0];

    let companion = req.body.companion.toLowerCase().trim().split(',');
    let adversary = req.body.adversary.toLowerCase().trim().split(',');

    couch.insert(plantdb,{
      _id:id,
      name: req.body.name.toLowerCase(),
      type: req.body.type.toLowerCase(),
      companion: companion,
      adversary: adversary,
      notes: req.body.notes.toLowerCase()
    }).then((data, headers, status)=>{
      res.redirect('/plants');
    },(err)=>{
      res.send(err)
    })
  })
})

app.listen(PORT,()=>{
  console.log('Server started on: ' + PORT)
});
