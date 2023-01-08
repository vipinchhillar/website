
const express = require('express');
const app = express();
const port = 8080;
const path = require('path');

app.set('views', path.resolve('../views'));
app.set('view engine', 'ejs');
var dir_ = path.resolve('../views');
fs = require('fs');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const ejs = require('ejs');
var fields = {displayPasswordError:"",
displayPhoneEmailError:"",
url:"",
var1:"",
}

//dynamic insertion (working fine tested)



var file = fs.readFileSync(dir_ + '/index.ejs', 'ascii');
var rendered_html_string = ejs.render(file,fields);
//converting the string to dom element
var document = new JSDOM(rendered_html_string);

el = new JSDOM('<button>hi</button>').window.document.body;

//inserting the element (type = html node)
document.window.document.getElementById("test_button").appendChild(el);


// finally sending the serialized version as response res.send(document.serialize())



app.get('/index', (req, res) => {
    
  fields.displayPasswordError = "";
  fields.displayPhoneEmailError = "";
  fields.var1 = "<button>hello</button>";
  

  res.send(document.serialize());
  


})



var bodyParser = require('body-parser')
app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({     
  extended: true
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.static(path.resolve('../css')));
const router = express.Router()


router.use(bodyParser.json());






app.get('/registration',(req,res)=> {

    
    res.render(path.join(dir_,'registration.ejs'),fields);


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
  email: String,
  phone: String,
  password:String
}, { collection: 'all_users' });

const User = mongoose.model('User', UserSchema);


var dict_to_enter_in_record = {phone:"",email:"",password:""}

app.post('/login',(req,res)=>{

  
  

  entered_dict = JSON.parse(JSON.stringify(req.body));
  dict_to_enter_in_record.password = entered_dict.password;
  var entry = entered_dict.email_or_phone;
  const regex_email = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  const regex_mobile = /^[0]?[789]\d{9}$/;
  
  if(regex_mobile.test(entry)){
    //its a valid mobile number
      dict_to_enter_in_record.phone = entry;
      var t_user = new User(dict_to_enter_in_record);
      t_user.save(t_user,function(err,result){
        if(err){
          res.send(err);
        }
        else{
          console.log("record added in db sucessfully...");
        }
    })
    res.send("You entered a valid mobile number..");
    clean(dict_to_enter_in_record);
  }
  
  else if(regex_email.test(entry)){
    //its a valid email adress
    
    dict_to_enter_in_record.email = entry;
    var t_user = new User(dict_to_enter_in_record);
    t_user.save(t_user,function(err,result){
      if(err){
        res.send(err);
      }
    })
    res.send('you entered a vaild email address');
    clean(dict_to_enter_in_record);
  }
  else{
    fields.displayPhoneEmailError = "Invalid email or phone!";
    res.render(path.join(dir_,'index.ejs'),fields);
    fields.displayPhoneEmailError = "";

  }
  
  
  
  
  
})

function clean(d){

    d.email = "";
    d.phone = "";
    d.password =  "";
}


app.listen(port, function () {
    console.log("Server is running on localhost:8080");
});


// Collection -> has many Documents.