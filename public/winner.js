// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo();

async function showWinningVideo() {
  let winner = await sendGetRequest("/getWinner");
  console.log(winner);
  //winner = JSON.parse(winner);
  //console.log(winner);
  winningUrl = winner.url;
  console.log(winningUrl);
  let name = document.getElementById("previewNickName");
  name.textContent = winner.nickname;
  // let winningUrl = "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166";
  addVideo(winningUrl, divElmt);
  loadTheVideos();
}
