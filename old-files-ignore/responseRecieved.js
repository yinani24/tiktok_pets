let yourPick = sessionStorage.getItem("videoName");

let text = `'${yourPick}'`;
document.getElementById("main_post_1_colored").innerHTML = text; 
let something = document.getElementById("button_post");

something.addEventListener("click", 
        function () {
            window.location = "tiktokpets.html";
        })