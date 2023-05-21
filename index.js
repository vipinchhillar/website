const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
var macaddress = require('macaddress');
const WebSocket = require('ws');


const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/gameDB');



const userSchema = new mongoose.Schema({
  m_no:{ 
  	type: String,
  	required: true,
    unique: true
	},
  pswd: String,
  mac_adr: {
    type:String,
    required:true
  },
  balance:{
    type:Number,
    required: true
  },
  playing: Boolean
});


const waitingList = new mongoose.Schema({
  uid:{ 
    type: String,
    required: true,
    unique: true
  },
  gametype: String
});

const singleGame = new mongoose.Schema({
  participants: {
    type: Array,
    required: true
  },
  gametype: {
    type: String,
    required: true
  }
});

const user = mongoose.model('reg_users', userSchema);
const w_user = mongoose.model('lobby_users', waitingList);
const single_game = mongoose.model('single_game', singleGame);


const port = 8080
app.use(express.static(__dirname+'/home'));
app.use(express.static(__dirname+'/login'));
app.use(express.static(__dirname+'/error'));
app.use(express.static(__dirname+'/media'));

app.listen(port, function () {
    console.log("Server is running on localhost:8080");
});








app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home/home.html'));
})
app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'error/error.html'));
})

app.post('/home/register',(req,res)=>{
	
	var dict = {m_no:'',pswd:'',mac_adr:'',balance:0,playing:false};
	dict.m_no = req.body.m_no.toString();
	dict.pswd = req.body.pswd.toString();
	macaddress.one((err, mac) => {
  		dict.mac_adr = mac;   
      
      const x = new user(dict);

      x.save()
      .then(() => {
        console.log('New User registered successfully');

        if (!res.headersSent) {
            res.sendStatus(228);
        }
      })
      .catch((err) => {
        console.log('Error while saving new User', err);
        res.sendStatus(227);
      });
  
  });
		
		

});

app.post('/home/login',(req,res)=>{
	
	user.findOne({	m_no: req.body.m_no.toString(),
					pswd: req.body.pswd.toString()
					})
 .then((docs)=>{
     if(docs==null){
     	res.sendStatus(237);
     }
     else{
     	res.sendStatus(238);
     }
 })
 .catch((err)=>{
     console.log(err);
 });

});


app.get('/:uid/login_page', (req, res) => {
    
  

  macaddress.one(function (err, mac) {

      user.findOne({  mac_adr: mac 

      })
      .then((docs)=>{
          if(docs==null){
          res.sendFile(path.join(__dirname, '/error/error.html'));
          //error login
        }
        else{

          res.sendFile(path.join(__dirname, '/login/login.html'));
          //successful login
        }
    })
    .catch((err)=>{
         console.log(err);
    });

  });



});





app.get('/:uid/login.js', (req, res) => {

    res.sendFile(path.join(__dirname, '/login/login.js'));

})

app.get('/:uid/login.css', (req, res) => {

    res.sendFile(path.join(__dirname, '/login/login.css'));

})

app.get('/data_retriving_url', (req, res) => {
    res.sendStatus(202);

})



app.post('/data_retriving_url',async (req, res)=> {
    if(req.body.req_type==="quit_game"){
        const uid = req.body.uid;
        user.updateOne({m_no:uid}, {playing:false})
        .then(result => {
              console.log('Document updated successfully');
              res.sendStatus(262);
        })
        .catch(err => {
           console.log('Error updating document:', err);
           res.sendStatus(261);
        });
    }
    else if(req.body.req_type==="fetch_balance"){
      const uid = req.body.uid.toString();
      user.findOne({  m_no: uid
          })
    .then((docs)=>{
      const dict = {balance: -2}
      dict.balance = docs.balance;
      res.send(JSON.stringify(dict));
    })
  .catch((err)=>{
     console.log(err);
     console.log("error while fetching balance");
     res.sendStatus(451);
    });

    }
    else if(req.body.req_type==="insert_in_WL"){
        
        var uid = req.body.uid;
        var gametype = req.body.gametype.toString();
        const dict = {uid:uid,gametype:gametype};
        const x = new w_user(dict);

        x.save()
        .then(() => {
          console.log('New User entered in waiting lobby successfully:',uid);
          res.sendStatus(252);
        })
        .catch((err) => {
          console.log('Error while inserting new user in waiting lobby', err);
          res.sendStatus(251);
        });

    }
    else if(req.body.req_type==="remove_from_WL"){
        const user_id = req.body.uid;
        w_user.deleteOne({ uid:user })
        .then(() => {
          console.log('User deleted from lobby successfully:',user_id);
          res.sendStatus(253);
        })
        .catch((err) =>{ 
          console.error(err)
          res.sendStatus(254);
        });

    }
    else if(req.body.req_type==="make_match"){

        user.findOne({  m_no: req.body.uid,
                        playing: true})
        .then((docs)=>{
            if(docs==null){
                
            }
            else{
              if (!res.headersSent) {
                  res.sendStatus(278);
              }
              
            }
        })
        .catch((err)=>{
            console.log(err);
        });




        const gametype = req.body.gametype;

        w_user.find({ gametype: gametype })
        .then(docs => {
          if(docs.length>4){
              var ary = []
              for (let i = 0; i <5; i++) {
                ary.push(docs[i].uid);


                user.updateOne({m_no:docs[i].uid}, {playing:true})
                .then(result => {
                  console.log('Document updated successfully');
                })
                .catch(err => {
                  console.log('Error updating document:', err);
                });


                w_user.deleteOne({uid:docs[i].uid})
                .then(()=>{
                  
                })
              }
              const x = new single_game({participants:ary,gametype:gametype});
              x.save()
              .then(() => {
                console.log('5 Users matched and deleted from lobby successfully');
                  console.log('5 users are inserted in a single game');
                  res.sendStatus(256);
                })
              .catch((err) => {
                  console.log('Error while inserting 5 users in a game', err);
                  res.sendStatus(257);
              });
          }
          else{
            console.log("not enough players to make a game");
            if (!res.headersSent) {
            res.sendStatus(258);
          }
            
          }
          
        })
        .catch(error => {
          console.log(error);
          res.sendStatus(259);
        });

    }
    else{
      console.log("not a valid post req",req.body.req_type,req.body.uid);
      res.sendStatus(204);
    }


})





