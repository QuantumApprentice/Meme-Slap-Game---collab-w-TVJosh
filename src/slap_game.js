const canvas = document.getElementById("canvas");

document.addEventListener("keydown", (e)=>{keyboard_callback(e)});
const ctx = canvas.getContext("2d");
let state = "Base";       //UnReady?
const slapCooldown  = 1000;
const dodgeCooldown = 1000;

ctx.fillStyle = "green";
ctx.fillRect(10,10,150,100);


function animate_slap() {
    state = "Slap";
    ctx.fillStyle = "red";
    ctx.fillRect(10,10,150,100);
    setTimeout(animate_base, slapCooldown);
    console.log(`Slap Cooldown: ${slapCooldown/1000}s`);
}
function animate_ready() {
    state = "Ready";
    ctx.fillStyle = "blue";
    ctx.fillRect(10,10,150,100);
}
function animate_base() {
    state = "Base";
    ctx.fillStyle = "green";
    ctx.fillRect(10,10,150,100);
}
function animate_dodge() {
    state = "Dodge";
    ctx.fillStyle = "black";
    ctx.fillRect(10,10,150,100);
    setTimeout(animate_base, dodgeCooldown);
    console.log(`Dodge Cooldown: ${dodgeCooldown/1000}s`);
}

function keyboard_callback(e) {
    console.log("e: ", e);

    if (e.keyCode == 32) {      //space
        //play slap animation
        //can only slap when Ready?
        //can dodge immediately after slap?
        if (state == "Ready") {
            console.log("Slap!");
            animate_slap();
        } else {
            console.log("Not Ready!");
        }


    }
    if (e.keyCode == 16) {      //shift
        console.log("Ready?");
        //play Ready animation
        //cannot dodge when Ready
        animate_ready();
    }
    if (e.keyCode == 17) {      //ctrl
        //if in Ready, return to UnReady? (base state?)
        //if in UnReady?(base state), play dodge animation
        if (state == "Ready") {
            console.log("UnReady?");
            animate_base();
        } else {
            console.log("Dodge?");
            animate_dodge();
        }
    }

}