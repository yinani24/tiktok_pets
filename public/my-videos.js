'use strict' //Mine
//console.log("Hi");
// document.getElementById("Line1").textContent = "HI";
//const db = require('./sqlWrap'); //Mine
  let addNew = document.getElementById("addNewButton");      
  addNew.addEventListener("click", function(){
    window.location = "tiktokpets.html";
  })

////////////////////// helpers to send HTTP requests
/// had to add 'let' in front of params..
async function sendGetRequest(url) {
  let params = {
    method: 'GET', 
    headers: {'Content-Type': 'text/plain'}
  };
  console.log("sending GET request to get data from the server.");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function sendPostRequest(url,data) {
  let params = {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data };
  console.log("about to send post request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}
// ///////////////////////////// building the page based on the result of the get request.
// async function getCount(){
//   let count = await sendGetRequest("/getCount");
//   return count;
// }

async function getList(){
  try{
    let list = await sendGetRequest("/getList");
    list = JSON.parse(list);
    console.log(list);
    return list;
  }catch(err){
    console.log("Problem getting the list of nicknames:", err);
  }
}


// getList().catch(function(err){
//   console.log("failed to get the list of nicknames. ", err);
// });
        
    // let videos = JSON.parse(data_recieved);
    // let count = sendGetRequest("/getCount");

buildDiv().catch(function(err){
  console.log("Problem in building the div with the buttons:", err);
})

async function buildDiv(){
  let list = await getList();
  for(let i = 0; i < list.length; i++){
    let nickname = list[i];
    document.getElementById(`Line${i+1}`).textContent = nickname;
    document.getElementById(`item${i+1}`).style.border = "2px solid lightgrey";
  }
  
  for(let j = list.length; j < 8; j++){
    document.getElementById(`Line${j+1}`).textContent = "";
    document.getElementById(`item${j+1}`).style.border = "2px dashed lightgrey";
  }
  
  // for (let i=0; i<8; i++) {
  //   document.getElementById(`item${i+1}`).style.border = "2px solid lightgrey";
  // }
  
  // for (let i=0; i<8; i++) {
  //   let size = document.getElementById(`Line${i+1}`);
  //   if (size.textContent.trim() === ''){
    
  //   document.getElementById(`item${i+1}`).style.border = "2px dashed lightgrey";
  // }
  // else {
    
    
  //   document.getElementById(`item${i+1}`).style.border = "2px solid lightgrey";
  // }
  //    document.getElementById(`item${i+1}`).style.border = "2px solid lightgrey";
  // }

  let CButtons = document.getElementsByClassName("CButton");
  for (let i=0; i<8; i++) {
    CButtons[i].addEventListener("click",function() {
      act(i);
    });
  }

  check(list);
  checkNew(list);
}

// buildDiv();
async function act(i){
  let value = document.getElementById(`Line${i+1}`).textContent;
  document.getElementById(`Line${i+1}`).textContent = "";
  document.getElementById(`item${i+1}`).style.border = "2px dashed lightgrey";
  Continuation(value);
  //////////////////////////////// RELOAD PAGE HERE
  window.location.reload();
}

function check(list){
  if(list.length !== 8){
    // document.getElementById("item8").textContent = counter;
    document.getElementById("playGame").disabled = true;
    document.getElementById("playGame").style.background = "rgba(238, 29, 82, 0.4)";
  }
  else {
    document.getElementById("playGame").disabled = false;
    document.getElementById("playGame").style.background = "rgba(238, 29, 82, 0.8)";
  }
}

function checkNew(list){
  //let list = await getList();
  if(list.length === 8){
    document.getElementById("addNewButton").disabled = true;
    document.getElementById("addNewButton").style.background = "rgba(238, 29, 82, 0.4)";  
  }
  else {
    document.getElementById("addNewButton").disabled = false;
    document.getElementById("addNewButton").style.background = "rgba(238, 29, 82, 0.8)";
  }
}


function Continuation(nickname){
  // let sent_data = JSON.stringify(nickname);
  sendPostRequest("/deleteVideo", nickname).then( function (response) {
    console.log("Deleted ", response);
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
}
