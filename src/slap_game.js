const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const slap_div = document.getElementById("slap");

document.addEventListener("keydown", keyboard_callback);
// document.addEventListener("keyup", keyboard_callback);
let state = "Base";       //UnReady?
const slapCooldown  = 1000;
const dodgeCooldown = 1000;
const WillSmith_offset = 410;  //pixels wide per frame
const WillSmith_sprite = "../resources/Will_Smith_slap_spritesheet.png";

const WillSmith = {
    "sprite" : WillSmith_sprite,
    "width"  : WillSmith_offset,
    // {"height" : ,
    "player1Dodge" : WillSmith_offset/2.5,
    "player2Dodge" : WillSmith_offset/2.5,
    "P1dodgeVec"   : +30,
    "P2dodgeVec"   : -30
};
const players = [
    WillSmith,
];




ctx.fillStyle = "green";        //Base/UnReady
ctx.fillRect(10,10,150,100);

let slap_image = new Image();
slap_image.src = players[0].sprite;
ctx.drawImage(
    slap_image,
    0,0,
    players[0].width, slap_image.height,
    0,0,
    players[0].width,
    slap_image.height
);

function animate_slap(level) {
    state = "Slap";
    ctx.fillStyle = "red";
    ctx.fillRect(10,10,150,100);
    setTimeout(()=>{animate_base(level)}, slapCooldown);
    console.log(`Slap Cooldown: ${slapCooldown/1000}s`);
}
function animate_ready(level) {
    state = "Ready";
    slap_image.src = players[level].sprite;
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    )
    ctx.drawImage(
        slap_image,
        players[level].width,0,
        players[level].width, slap_image.height,
        0,0,
        players[level].width,
        slap_image.height
    );
    // ctx.fillStyle = "blue";
    // ctx.fillRect(10,10,150,100);
}
function animate_base(level) {
    console.log("level: ", level);
    console.log("Width: ", players[level].width);
    slap_image.src = players[level].sprite;
    state = "Base";
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    )
    ctx.drawImage(
        slap_image,
        0,0,
        players[level].width, slap_image.height,
        0,0,
        players[level].width,
        slap_image.height
    );
    // ctx.fillStyle = "green";
    // ctx.fillRect(10,10,150,100);
}
function animate_player_dodge(level) {
    state = "Dodge";
    slap_image.src = players[level].sprite;
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    )
    ctx.drawImage(
        slap_image,
        0,0,
        players[level].player1Dodge, slap_image.height,
        players[level].P2dodgeVec,0,
        players[level].player2Dodge,
        slap_image.height/2
    );

    ctx.drawImage(
        slap_image,
        players[level].player1Dodge,0,
        players[level].width, slap_image.height,
        players[level].player1Dodge,0,
        players[level].width,
        slap_image.height
    );

    // setTimeout(()=>{animate_base(level)}, dodgeCooldown);
    // timeoutCallback(level, dodgeCooldown);
    setTimeout(()=>{animate_base(level)},dodgeCooldown);
    console.log(`Dodge Cooldown: ${dodgeCooldown/1000}s`);
}

function keyboard_callback(e) {
    // console.log("e: ", e);

    if (e.keyCode == 32) {      //space
        //play slap animation
        //can only slap when Ready?
        //can dodge immediately after slap?
        if (state == "Ready") {
            console.log("Slap!");
            animate_slap(0);
        } else {
            console.log("Not Ready!");
        }


    }
    if (e.keyCode == 16) {      //shift
        console.log("Ready?");
        //play Ready animation
        //cannot dodge when Ready
        animate_ready(0);
    }
    if (e.keyCode == 17) {      //ctrl
        //if in Ready, return to UnReady? (base state?)
        //if in UnReady?(base state), play dodge animation
        if (state == "Ready") {
            console.log("UnReady?");
            animate_base(0);
        } else {
            console.log("Dodge?");
            // animate_dodge();
            animate_player_dodge(0);
        }
    }

}