
function closeBox(id){
  document.getElementById(id).style.display = "none";
}

function openBox(id){
  document.getElementById(id).style.display = "block";
}
function changeInnerHtml(id,msg){
  document.getElementById(id).innerHTML = msg;
}
function changeValue(id,val){
  document.getElementById(id).value = val;
}
function getOtp(){
  var entry = document.getElementById('m_number_box_reg').value;
  if(entry.toString().length!=10){
    document.getElementById('error-msg').innerHTML = "Enter a vaild 10-digit mobile number";
    openBox('error-msg-form');
  }
  else{
    openBox('otp-taker');
    changeValue('get-otp-btn',"Resend OTP");
    
  }

}

function verifyOtp(){
  var entry = document.getElementById('otp-box').value;
  if(entry != 123456){
    document.getElementById('error-msg').innerHTML = "Invalid OTP!";
    openBox('error-msg-form');
  }
  else{
    openBox('create-pswd-form')
    closeBox('reg-form')
  }
}


function postRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .catch(error => {
    console.error('There was an error with the POST request:', error);
  });
}

function insertUser(){
  var entry1 = document.getElementById('first-pswd').value;
  entry1 = entry1.toString()
  var entry2 = document.getElementById('second-pswd').value;
  entry2 = entry2.toString()

  if(entry1.length==0 || entry2.length==0){
    document.getElementById('error-msg').innerHTML = "Passwords can not be empty";
    openBox('error-msg-form');
  }
  else if(entry1.localeCompare(entry2)){
    document.getElementById('error-msg').innerHTML = "Both Passwords Don't Match";
    openBox('error-msg-form');
  }
  else if(entry1.length<8){
    document.getElementById('error-msg').innerHTML = "Password must contain at least 8 characters";
    openBox('error-msg-form');
  }
  else {
    
  var m_no = document.getElementById("m_number_box_reg").value;
  var pswd = document.getElementById("first-pswd").value;


  var data = { m_no: '', pswd: ''};
  data.m_no = m_no.toString();
  data.pswd = pswd.toString();
  

  postRequest('http://localhost:8080/home/register', data)
  .then(response => {
      
      if(response==227){
        //tried to insert duplicate entry.
        document.getElementById('error-msg').innerHTML = "User Already Registered. Please Login to continue.";
        openBox('error-msg-form');
      }
      else if(response==228){
          var url = 'http://localhost:8080/'+m_no.toString()+'/login_page';
          window.location = url;
          
      }
  });

  closeBox('create-pswd-form');


  
    
    



  }





  













}


function loginUser(){
  var entry1 = document.getElementById('m_number_box_login').value;
  entry1 = entry1.toString()
  var entry2 = document.getElementById('pswd_box_login').value;
  entry2 = entry2.toString()


  var data = { m_no: '', pswd: '' };
  data.m_no = entry1;
  data.pswd = entry2;


  postRequest('http://localhost:8080/home/login', data)
  .then(response => {
      if(response==237){
        //tried to insert duplicate entry.
        document.getElementById('error-msg').innerHTML = "Mobile Number or password is wrong.";
        openBox('error-msg-form');
      }
      else if(response==238){
          window.location = "http://localhost:8080/"+entry1.toString()+'/login_page';
      }
  });


}






