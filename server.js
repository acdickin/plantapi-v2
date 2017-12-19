var bodyParser = require('body-parser');
var NodeCouchDB = require('node-couchdb');
var bcrypt = require('bcryptjs');

var plantRoutes = require('./routes/plant')
var userRoutes = require('./routes/user')

var path = require('path');
var express =require('express');
var app = express();

var Promises= require('bluebird');


const couch = new NodeCouchDB({
  auth:{
    user:'superman',
    password:'Cloudy88!'
  }
});

const PORT =3000;
// couch.listDatabases().then((dbs)=>{
//   console.log(dbs);
// })
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/', (req,res)=>{
  res.render('index');
})

const plantdb='plants';
const AllPlantsView='_design/all_plants/_view/all';



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
