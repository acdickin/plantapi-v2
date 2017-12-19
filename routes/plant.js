var express =require('express');
var app = express();
var path = require('path');
//
//plant routes
//
const plantdb='plants';
const AllPlantsView='_design/all_plants/_view/all';

export const allPlants = () => {
  app.get('/plants', (req,res)=>{
    couch.get(plantdb,AllPlantsView).then(
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
}

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
