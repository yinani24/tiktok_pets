// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");
// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
// create object to interface with express
const app = express();
// not sure what this does, but it was in the example code for databases.
//const fetch = require("cross-fetch");
// get Promise-based interface to sqlite3 and set-up the databse
const db = require('./sqlWrap');

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
});

// clearDB().then(function(){
//   console.log("database emptied");
// })
// .catch(function(error){
//   console.log("didn't empty the database: ", error);
// });

////////// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
});

app.use(express.static("public"));
app.use(express.text());
// app.use(bodyParser.json());
//app.use(express.json());
// make all the files in 'public' available 

app.use(function(req, res, next) {
  console.log("body contains",req.body);
  next();
});



// app.post("/videoData", (req, res) =>{
//   console.log("sending Response")
//   return res.send('recieved POST'); 
// });



//// handling database requests

/////////////////////////////////////// insert video to database
app.post("/videoData", handleAddVideo);

async function handleAddVideo(req, res){
  try{
    console.log("VideoData post request");
    let video = JSON.parse(req.body);
    // console.log("Parsed: ", video);
    let size = await getCount();
    if(size < 8){
      await resetMostRecentVid();
      await insertVideo(video);
      console.log("Video added!");
      return res.send("Video added!");
      // await printDB();
    }else{
      console.log("database full!");
      // await printDB();
      return res.send("database full");
    }
  }catch(error){
    console.log("Error in adding video:", error);
  }
}

//////////////////////////////////////////// remove video from database
// only send the nickname in the post request.
app.post("/deleteVideo", handleDeleteVideo);

async function handleDeleteVideo(req, res, next){
  try{
    let size = await getCount();
    if(size > 0){
      let name = req.body;
      let v = {
        nickname : name
      }
      await deleteVideo(v);
      console.log("Video deleted!", v);
      return res.send("Video deleted!");
    }else{
      console.log("database empty!");
      return res.send("database empty!");
      
    }
  }catch(error){
    console.log("error with deletion:", error);
  }
}

///////////////////// get most recently added video
app.get("/getMostRecent", handleGetMostRecent);
async function handleGetMostRecent(req, res){
  try{
    let videoObj = await getMostRecent();
    console.log("Most recently added:", videoObj);

    let vidString = JSON.stringify(videoObj);
    console.log("Getting the most recent video:", vidString);
    return res.send(vidString);
    
  }catch(error){
    console.log("Problem getting the most recent video:", error);
  }
}

/////////////////////////////////////////////////////// get all videos [made by yash]
/// changelog -- Adityaa -- made it send a list of nicknames instead of the entire video objects as that is all we need. 
app.get("/getList", handleGetList);

async function handleGetList(req, res){
  console.log("Get List get request recieved.");
  try{
    let videoObj = await dumpTable();
    //console.log("Get Table:", videoObj);
    
    let nickList = Array();
    for(let i = 0; i < videoObj.length; i++){
      nickList.push(videoObj[i].nickname);
    }
    
    let vidString = JSON.stringify(nickList);
    //console.log("List of all nicknames as a string:", nickList);
    return res.send(vidString);
    
  }catch(error){
    console.log("Problem getting the list of all videos:", error);
    //return res.send("Error, wasn't able to get a list of videos.");
  }
}
/////////////////////////////////////////////////// get the number of items in the DB.
app.get("/getCount", handleGetCount);
async function handleGetCount(req, res){
  console.log("Get Count get request recieved.");
  try{
    let count = await getCount();
    //console.log("Count of videos", count);

    //let sentCount = JSON.stringify(count);
    //console.log("Sending the count:", count);
    return res.send(""+count);
    
  }catch(error){
    console.log("Problem getting the count:", error);
  }
}


//////////////////////////////////// end of pipeline operations
// Need to add response if page not found!
app.use(function(req, res){
  res.status(404); res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


//////////////////////////////////////// helper fumnctions
async function deleteVideo(videoObject){
  const del_sql = 'delete from VideoTable where nickname = ?';
  await db.run(del_sql, [videoObject.nickname]);
}

async function resetMostRecentVid(){
  let v = await getMostRecent();
  if(v != undefined){
    const del_sql = 'delete from VideoTable where flag = TRUE';
    await db.run(del_sql);
    const ins_sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,FALSE)";
    await db.run(ins_sql,[v.url, v.nickname, v.userid]);
  }

}

async function getMostRecent(){
  const sql = 'select * from VideoTable where flag = ?';
  let mostRecentVid = await db.get(sql, [true]);
  return mostRecentVid;
}

async function getCount() {
   const tableContents = await dumpTable();
   return tableContents.length;
}

async function insertVideo(v) {
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";
  await db.run(sql,[v.url, v.nickname, v.userid]);
}

// an async function to get a video's database row by its nickname
async function getVideo(nickname) {

  // warning! You can only use ? to replace table data, not table name or column name.
  const sql = 'select * from VideoTable where nickname = ?';
  let result = await db.get(sql, [nickname]);
  return result;
}
async function clearDB(){
  const sql = 'DELETE from VideoTable where flag = ?';
  await db.run(sql, [true]);
  await db.run(sql, [false]);
  
}

// an async function to get the whole contents of the database 
async function dumpTable() {
  const sql = "select * from VideoTable";
  
  let result = await db.all(sql)
  return result;
}

async function printDB(){
  const sql = "select * from VideoTable";
  
  let result = await db.all(sql)
  console.log(result);
}

////////////////////////////////// example code from Prof...
///////////////////////////////// Just need to move a few things around
//////////////////////////////// and wrap in functions that can be 
/////////////////////////////// called when a POST request comes by.
/****************************/
/* some database operations */
/****************************/


// // test the function that inserts into the database
// function databaseCodeExample() {

//   console.log("testing database");

//   // put the video data into an object
//   let vidObj = {
// "url": "https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854",
//  "nickname": "Cat vs Fish",
//  "userid": "ProfAmenta"
//    }


// async function insertAndCount(vidObj) {

//    await insertVideo(vidObj);
//    const tableContents = await dumpTable();
//    console.log(tableContents.length);
//  }

//insertAndCount(vidObj)
  //.catch(function(err) {console.log("DB error!",err)});

  /*
  
  insertVideo(vidObj)
    .then(function() {
      console.log("success!");
    })
    .catch(function(err) {
      console.log("SQL error",err)} );

  dumpTable()
  .then(function(result) {
    let n = result.length;
    console.log(n+" items in the database"); })
  .catch(function(err) {
      console.log("SQL error",err)} );
  */
  
  // getVideo("Cat vs Fish")
  //   .then(function(result) {
  //     // console.log("row contained",result); 
  //         })
  //   .catch(function(err) {
  //     console.log("SQL error",err)} );

//}


// ******************************************** //
// Define async functions to perform the database 
// operations we need

// An async function to insert a video into the database




