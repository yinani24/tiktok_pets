let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");

let heartButtons = document.querySelectorAll("div.heart");

let videoNumber = 2;

let nextButton = document.getElementsByClassName("enabledButton");

async function getTwoVideos(){
  try{
    let returned_data = await sendGetRequest("/getTwoVideos");
    console.log(returned_data);
    data = returned_data;
    //let parsed_data = JSON.parse(returned_data);
    for (let i=0; i<2; i++) {
        addVideo(returned_data[i].url,videoElmts[i]);
      }
  }  
  catch(err){
      console.log("Error while passing two videos", err);
  }
}

getTwoVideos();

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  let heartButton = heartButtons[i];
  // let hidden_icon = heartButtons[i].getElementsByClassName("fas fa-heart");
  // let inline_icon = heartButtons[i].getElementsByClassName("far fa-heart");
  heartButtons[i].classList.add("unloved");
  heartButton.addEventListener("click",function() {changeHeart(i)});
} // for loop


async function changeHeart(i){
  if(i === 0){

    videoNumber = 0;
    let ele = document.getElementById("firsticon");

    // ele.parentNode.removeChild(ele);
    // let added = heartButtons[i].createElement("i");
    ele.classList.remove("far", "fa-heart");
    ele.classList.add("fas", "fa-heart");
    ele.classList.add("loved");
    // heartButtons[0].querySelectorAll("fas fa-heart").style.color = 'rgba(238, 29, 82, 0.9)';  
    // // heartButtons[0].classList.style.borderColor = 'rgba(238, 29, 82, 0.9)';
     let ele2 =  document.getElementById("secondicon");
    if(ele2.classList.contains("loved")){
      console.log("inside");
      ele2.classList.remove("fas", "fa-heart");
      ele2.classList.remove("loved");
      ele2.classList.add("far", "fa-heart");
      ele2.classList.add("unloved");  
    }
  }
  else{

    videoNumber = 1;
    
    let ele = document.getElementById("secondicon");

    // ele.parentNode.removeChild(ele);
    // let added = heartButtons[i].createElement("i");
    ele.classList.remove("far");
    ele.classList.add("fas");
    ele.classList.add("loved");
    // heartButtons[0].querySelectorAll("fas fa-heart").style.color = 'rgba(238, 29, 82, 0.9)';  
    // // heartButtons[0].classList.style.borderColor = 'rgba(238, 29, 82, 0.9)';
    let ele2 =  document.getElementById("firsticon");
    if(ele2.classList.contains("loved")){
      ele2.classList.remove("fas", "fa-heart");
      ele2.classList.remove("loved");
      ele2.classList.add("far", "fa-heart");
      ele2.classList.add("unloved");  
    }
  }
  
}

nextButton[0].addEventListener("click", function() {
  videoPreferred() });

async function videoPreferred(){
  
  let sent_data = Array();

  if(videoNumber === 1){
    sent_data.push(data[1].rowIdNum);
    sent_data.push(data[0].rowIdNum);
  }
  else if(videoNumber === 0){
    sent_data.push(data[0].rowIdNum);
    sent_data.push(data[1].rowIdNum);
  }
  else{
    console.log("Nothing was liked");
  }
  
  let response = await sendPostRequest("/insertPref", sent_data);

  console.log("sent Post request");
  if(response === "continue"){
    window.location = "compare.html";
  }
  else if(response === "pick winner"){
    window.location = "winner.html";
  }
  
}

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.
// const urls = ["https://www.tiktok.com/@berdievgabinii/video/7040757252332047662",
// "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166"];

    // load the videos after the names are pasted in! 
    loadTheVideos();



    