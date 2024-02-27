let reloadButton = document.getElementById("reload");
let divElmt = document.getElementById("tiktokDiv");
let outerBox = document.getElementById("video");

// add video to page
addVideo(divElmt);
// on start-up, load the videos
loadTheVideos();

//reloads the video
reloadButton.addEventListener("click",reloadVideo);

// Continue Button on-click listener
document.getElementById("continueButton").addEventListener("click", function(){
  window.location = "/index.html";
  updateDB();
  // add to database
})

/////////////////////////////////////// Tiktok helpers

async function addVideo(divElmt) {

  let tiktokVid = await getMostRecentVideo();
  let tiktokurl = tiktokVid.url;

  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);
  divElmt.appendChild(block);

  document.getElementById("previewNickName").textContent = tiktokVid.nickname;
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}

// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
function reloadVideo () {
  
  // get the two blockquotes
  let blockquotes = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(divElmt);
  loadTheVideos();
}

async function sendGetRequest(url) {
  params = {
    method: 'GET', 
    headers: {'Content-Type': 'text/plain'}
  };
  console.log("about to send get request");
  
  let response = await fetch(url,params);
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

///////////////////////// Database helpers
async function getMostRecentVideo(){

  let vidString = await sendGetRequest("/getMostRecent");
  console.log("Result from get request:", vidString);
  let video = JSON.parse(vidString);
  console.log("Object bruh:", video);
  
  // let video = {
  //   url : "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
  //   name : "Fish hits Cat"
  // }

  //https://www.tiktok.com/@dobretwins/video/7093950205325823275
  
  return video;
}