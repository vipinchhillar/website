var waiting_to_match = false;



const url = window.location.href;
const regex = /\/(\d+)\/login_page/;
const match = regex.exec(url);
const uid = match[1];


function setWaiting(){
	waiting_to_match = true;
}
function removeWaiting(){
	waiting_to_match = false;
}




function getBalance() {
    const data = { req_type: "fetch_balance", uid: uid };
    fetch('http://localhost:8080/data_retriving_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('balance').innerHTML = data.balance;
        })
        .catch(error => {
            console.log("error while receiving response");
            console.error(error);
            throw error;
        });
}
function insertUserInWaitingList(gametype){
	const user_id = uid.toString();
	const data = { req_type: "insert_in_WL", uid: user_id,gametype:gametype};
    fetch('http://localhost:8080/data_retriving_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            
        })
        .catch(error => {
            console.log("error while receiving response");
            console.error(error);
            throw error;
        });


        document.getElementById('error-msg').innerHTML = "Thanks for waiting in the lobby. Please don't close this window";
    	openBox('error-msg-form');

}

function closeBox(id){
  document.getElementById(id).style.display = "none";
}
function openBox(id){
  document.getElementById(id).style.display = "block";
}

function removeUserfromWL(){
	const user_id = uid.toString();
	const data = { req_type: "remove_from_WL", uid: user_id};
    fetch('http://localhost:8080/data_retriving_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            
        })
        .catch(error => {
            console.log("error while receiving response");
            console.error(error);
            throw error;
        });
}


function quitGame(){


		const data = { req_type: "quit_game", uid: uid};
	    fetch('http://localhost:8080/data_retriving_url', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json'
	        },
	        body: JSON.stringify(data)
	    })
        .then(response => {
        	if(response.status==262){
        		closeBox("gamearea");
  				openBox('strip_1');
  				openBox('acc_settings_button');

        	}
        })	
        .then(data => {
            
        })
        .catch(error => {
            console.log("error while receiving response");
            console.error(error);
            throw error;
        });

        closeBox("gamearea");
  		openBox('strip_1');
  		closeBox('binary_box');


}



window.addEventListener('load', starter);
window.addEventListener('beforeunload',cleaner);

function continousMatchMaker(){
	if(waiting_to_match==true){

		console.log("waiting to match...")
		OneTimematchMaker();
	}
	setTimeout(continousMatchMaker,5000);
	
}

async function starter(){
	getBalance();
	continousMatchMaker();
	
		
}

function cleaner() {
  removeUserfromWL();
  closeBox("gamearea");
  openBox('strip_1');
  quitGame();
  
  
}

function makeMatch(gametype){
	const data = { req_type: "make_match", gametype: gametype,uid:uid};
    fetch('http://localhost:8080/data_retriving_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
        	console.log("make match response status:",response.status);
        	if(response.status===256 || response.status===278){
        		closeBox('error-msg-form');
        		closeBox('strip_1');
        		openBox('gamearea');
        		closeBox('acc_settings_button');
        		removeWaiting();
        	}
        	
        	response.json()

        })
        .then(data => {
            
        })
        .catch(error => {
            console.log("error while receiving response");
            console.error(error);
            throw error;
        });
}

function OneTimematchMaker(){
	makeMatch('game1');
	makeMatch('game2');
	makeMatch('game3');
}

