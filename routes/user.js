var express =require('express');
var app = express();
var path = require('path');
//
//user routes
//
const userdb='users';
const UserView = '_design/user/_view/user';


app.get('/user/:_id', (req,res)=>{
  couch.get(userdb, UserView).then(
    (data, header, status)=>{
        console.log(req);
        res.render('user',{
          user:data.data.rows
        })
    },
    (err)=>{
       res.send(err)
    })
})

app.post('/user/add', (req,res)=>{
  couch.uniqid().then(()=>{
    const id =ids[0];
    couch.insert(userdb,{
        _id:id,
    		username: req.body.user.username,
    		email: req.body.user.email,
    		firstname: req.body.user.firstname,
    	  lastname: req.body.user.lastname,
    		passhash:bcrypt.hashSync(req.body.user.pass, 10),
    		plotHeight:2,
    		plotWidth:4
      }).then((data, headers, status)=>{
        res.send("user succesfully created");
      },(err)=>{
        res.send(err)
    })
  })
})
