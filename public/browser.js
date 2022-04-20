// document.getElementById("continue").onclick = function () {
//         var textEntered = "";
//         textEntered = document.getElementById("rough").value;
//         console.log(textEntered);
//       }

////// DOM Elements:
// Text inputs
let username = document.getElementById("usernameIn")
let tiktokUrl = document.getElementById("tiktokUrl")
let videoName = document.getElementById("videoName")
// buttons
let continueButton = document.getElementById("continue")
let myVideosButton = document.getElementById("myVideos")


// the function to excute once the server responds.
function requestSuccess(data){
  console.log(data);
}


// function to send POST request
async function sendPostRequest(url,data) {
  console.log("about to send post request");

  // get the response from the server.
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  
  if (response.ok) {
    let data = await response.text();
    // Do the things you have to do if the server returns successfully.
    requestSuccess(data);
    return data;
  } else {
    throw Error(response.status);
  }
}


continueButton.addEventListener("click", 
        function () {
          let usernameText = username.value;
          let tiktokUrlText = tiktokUrl.value;
          let videoNameText = videoName.value;
          let txtData = `{"username": ${usernameText}, "tiktokUrl": ${tiktokUrlText}, "videoName": ${videoNameText}}`
          
          sendPostRequest("/videoData", txtData);
          console.log(txtData);
          
        })

