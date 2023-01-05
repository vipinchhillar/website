const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static(path.resolve('../css')));
const router = express.Router()


router.use(bodyParser.json());



app.get('/index', (req, res) => {
    
    var dir_ = path.resolve('../html');
    res.sendFile(path.join(dir_, '/index.html'));


})
app.get('/registration',(req,res)=> {

    var dir_ = path.resolve('../html');
    res.sendFile(path.join(dir_, '/registration.html'));


})
app.get('/css_index', (req, res) => {
  var dir_ = path.resolve('../css/index.css')
  res.sendFile(dir_);

});

app.get('/css_registration', (req, res) => {
  var dir_ = path.resolve('../css/registration.css')
  res.sendFile(dir_);

});

const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const con_str = 'mongodb://127.0.0.1:27017/Users';
mongoose.connect(con_str,function(error){
  if(error){
    throw error;
  }
  else{
    console.log("connected to the database \""+con_str+"\"");
  }
}, {useNewUrlParser: true});


var UserSchema = new mongoose.Schema({
  email_or_phone: String,
  password:String
}, { collection: 'all_users' });

const User = mongoose.model('User', UserSchema);




app.post('/login',(req,res)=>{

  req_dict = JSON.parse(JSON.stringify(req.body));
  var t_user = new User(req_dict);
  t_user.save(t_user,function(err,result){
      if(err){
        res.send(err);
      }
      else{
        res.send("Record Inserted Sucessfully in the Database!");
        
      }
  })
  
  
  
})




app.listen(port, function () {
    console.log("Server is running on localhost8080");
});


// Collection -> has many Documents.