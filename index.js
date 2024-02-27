'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  //console.log(n);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,false);
  console.log(winner);
  let sent_data = await callingTheTableforSpecificRowId(winner);
  console.log(sent_data);
  // you'll need to send back a more meaningful response here.
  res.json(sent_data);
  } catch(err) {
    res.status(500).send(err);
  }
});

//to get two videos to display

app.get("/getTwoVideos", handlegetTwoVideos);

async function handlegetTwoVideos(req,res){
  try{

    console.log("Entered the function");
    let result = await callingTheTable();
    console.log(result.length);
    let return_list = Array();
    let rowIdNum1 = getRandomInt(result.length);
    let rowIdNum2 = getRandomInt(result.length);

    console.log("RowId1", rowIdNum1);
    while(rowIdNum2 === rowIdNum1){
      rowIdNum2 = getRandomInt(result.length);
    }

    let videoObj = await getOneVideo(rowIdNum1);
    return_list.push(videoObj);
    
    for(let i = 0; i < 1; i++){  
      videoObj = await getOneVideo(rowIdNum2);
      return_list.push(videoObj); 
      console.log("RowId2",rowIdNum2);
    }
    
    console.log("Objects formed and added");
    let vidString = JSON.stringify(return_list);
    return res.send(vidString);
    
  }catch(error){
    console.log("Problem getting the two videos:", error);
  }
}

app.post("/insertPref", handleinsertPref);

async function handleinsertPref(req,res){
  try{
    let goodBadVideo = req.body;
    console.log(goodBadVideo);
    await insertintoPref(goodBadVideo);
    console.log("PrefTable updated");
    let length = await getCountPrefTable();
    console.log(length);
    if(length < 15){
      res.send("continue");
    }  
    else{
      res.send("pick winner");
    }  
  }catch(error){
    console.log("Error with insertion into Pref", error);
  }
}

async function insertintoPref(data){
  const sql = 'insert into PrefTable (better, worse) values (?,?)';
  await db.run(sql,[data[0],data[1]]);
}

async function getCountPrefTable(){
  const sql = 'select * from PrefTable';
  let result =  await db.all(sql);
  return result.length;
}

async function callingTheTable(){
  const sql2 = 'select * from VideoTable';
  let result = await db.all(sql2);
  //console.log(result);
  return result;
}

async function callingTheTableforSpecificRowId(rowIdNum){
  const sql2 = 'select * from VideoTable where rowIdNum = ?';
  let result = await db.get(sql2,[rowIdNum]);
  //console.log(result);
  return result;
}

async function getOneVideo(rowIdNum) {

  // warning! You can only use ? to replace table data, not table name or column name.
  // const sql2 = 'select * from VideoTable'; 
  // const sql = 'select * from VideoTable where rowIdNum = ?';
  // let result = await db.get(sql, [rowIdNum]);
  let result2 = await callingTheTable();
  let returned_result = result2[rowIdNum];
  console.log(returned_result);
  return returned_result;
}

// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});

