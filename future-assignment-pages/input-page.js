let continueButton = document.getElementById("continue");
continueButton.addEventListener("click",buttonPress);

let myVidsButton = document.getElementById("myVideosButton");
myVidsButton.addEventListener("click", function(){
  window.location = "index.html";
})

// given function that sends a post request
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

  // url,nickname,userid,mostRecent --> THESE ARE THE NAME OF THE FIELDS IN THE DATABASE.
  // PLEASE USE THESE NAMES.
  let data = json.stringify({
    userid: username,
    url : URL,
    nickname: nickname
  })
    
  sendPostRequest("/videoData", data)
  .then( function (response) {
    console.log("Response recieved", response);
    sessionStorage.setItem("nickname", nickname);
    window.location = "confirmationpage.html";
  })
  .catch( function(err) {
    console.log("POST request error",err);
  });
}
