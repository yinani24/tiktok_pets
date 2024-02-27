// POST method implementation; sends plain text to the server.


// sendPostRequest

// A wrapper around the built-in asynchronous function "fetch".
// There are two weird things about fetch that this wrapper hides. 
// One is that the data from the body of the response has to be retrieved using a second 
// built-in asynchronous function, the response.text() method.
// The second is that it does not count server errors as "failure",
// although as far as the code doing the fetch is usually concerned, this is a failure. 

let button = document.getElementById("continue");
button.addEventListener("click",buttonPress);

let myVidsButton = document.getElementById("myVideosButton");
myVidsButton.addEventListener("click",function(){
  window.location = "index.html";
});


async function sendPostRequest(url,data) {
  params = {
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

function buttonPress() { 
        // Get all the user info.
    let username = document.getElementById("user").value;
    let URL = document.getElementById("URL").value;
    let nickname = document.getElementById("nickname").value;

    // url,nickname,userid,flag --> THESE ARE THE NAME OF THE FIELDS IN THE DATABASE.
      // PLEASE USE THESE NAMES.
    let videoObject = {
        userid: username,
        url : URL,
        nickname: nickname
    };
    
    let sent_data = JSON.stringify(videoObject);
    // let data = username+","+URL+","+nickname;
    // const obj = JSON.stringify(data);
    
  sendPostRequest("/videoData", sent_data).then( function (response) {
      console.log("Response recieved", response);
      // sessionStorage.setItem("nickname", nickname);
      if(response == "database full"){
        alert("Database full");
        window.location = "index.html";
      } else {
        window.location = "confirmationpage.html";
      }
    })
    .catch( function(err) {
      console.log("POST request error",err);
    });
}




// // Added by yash
// async function getRequest(url) {
//   params = {
//     method: 'GET', 
//     headers: {'Content-Type': 'text/plain'},
//     body: data };
//   console.log("about to get request");
  
//   let response = await fetch(url,params);
//   if (response.ok) {
//     let data = await response.text();
//     return data;
//   } else {
//     throw Error(response.status);
//   }
// }

// function buttonPress() { 
//         // Get all the user info.
    
//     // url,nickname,userid,flag --> THESE ARE THE NAME OF THE FIELDS IN THE DATABASE.
//       // PLEASE USE THESE NAMES.

//   getRequest("/getMostRecent").then( function (response) {
        
//     let videoObject = JSON.parse(data);
//     let recentUrl = videoObject.url;
//       console.log("Response recieved", response);
//       // sessionStorage.setItem("nickname", nickname);
//       window.location = "confirmationpage.html";
//     })
//     .catch( function(err) {
//       console.log("POST request error",err);
//     });
// }
