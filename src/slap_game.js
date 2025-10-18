document.addEventListener("keydown", keyboard_callback);
const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");
const levelSelect = document.getElementById("level");

/*          tvJosh          */
document.addEventListener("load",()=>{
    p1.ScoreDiv = document.getElementById('p1_score');
    p2.ScoreDiv = document.getElementById('p2_score');
}, 1000);
const TRY_SLAP_STATE = 0;
const SLAPPING_STATE = 1;
const DODGE_STATE    = 2;
const IDLE_STATE     = 3;

/*          end         */



const slapCooldown  = 1000;
const dodgeCooldown = 1000;

const WillSmith = {
    "sprite"      : "../resources/Will_Smith_slap_spritesheet.png",
    "sprite_w"    : 410,
    "p1_X"        : 410/2.5,
    "p2_X"        : 0,
    "p1_W"        : 410/2.5,
    "p2_W"        : 410 - (410/2.5),

    "p1_SlapX"    : (410*3) + (410/2.5),
    "p2_SlapX"    : 410*3,

    "p1_DodgeX"   : 0,
    "p2_DodgeX"   : 410/2.5,
    "p1_DodgeVec" : +30,
    "p2_DodgeVec" : -30
};
const characters = [
    WillSmith,
];


levelSelect.innerHTML = '<option value="0">Will Smith</option>';
levelSelect.innerHTML += '<option value="1">Robin Hood</option>';

let p1ScoreDiv;
let p2ScoreDiv;
let p1 = {
    "Player"     : 1,
    "State"      : IDLE_STATE,   //UnReady?
    "Anim_Frame" : 0,
    "Next_Frame" : 0,
    "ScoreDiv"   : p1ScoreDiv,
    "SlapCount"  : 0
};
let p2 = {
    "Player"     : 2,
    "State"      : IDLE_STATE,   //UnReady?
    "Anim_Frame" : 0,
    "Next_Frame" : 0,
    "ScoreDiv"   : p2ScoreDiv,
    "SlapCount"  : 0
};



ctx.fillStyle = "green";        //Base/UnReady
ctx.fillRect(10,10,150,100);


let slap_image = new Image();
slap_image.src = characters[0].sprite;
ctx.drawImage(
    slap_image,
    0,0,
    characters[0].sprite_w, slap_image.height,
    0,0,
    characters[0].sprite_w, slap_image.height,
);

// player = which player is doing the slapping
// idx    = which sprite animation frame to display
function drawSlap(player,idx) {
    const offset = idx*player.spriteW;
    if (offset > slap_image.width) {
        animateReady(player);
        return;
    }
    ctx.clearRect(
        player.x,0,
        player.w,canvas.height
    );
    ctx.drawImage(
        slap_image,                 //image
        player.slapX + offset,0,    //sx,sy
        player.w,slap_image.height, //sw,sh

        player.x,0,                 //dx,dy
        player.w,slap_image.height  //dw,dh
    );
}

function animate_slap(player, time) {
    // console.log("animating slap, frame: ", p1.Anim_Frame);

    slap_image.src = player.sprite;

    if (time > player.Next_Frame) {
        player.Anim_Frame++;
        player.Next_Frame = time + 200;
    }
    drawSlap(player,player.Anim_Frame);
}

function animateReady(player) {
    slap_image.src = player.sprite;
    player.State = IDLE_STATE;
    player.Anim_Frame = 0;

    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    );
    ctx.drawImage(
        slap_image,
        player.x,0,
        player.w, slap_image.height,
        player.x,0,
        player.w, slap_image.height
    );
}

function animateDodge(player) {
    console.log("dodging?");
    slap_image.src = player.sprite;
    player.State = DODGE_STATE;
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    );
    ctx.drawImage(
        slap_image,
        0,0,
        player.dodgeX, slap_image.height,
        player.dodgeV,0,
        player.dodgeX,
        slap_image.height/2
    );
}

let keyPressed = 0;


/*          tvJosh          */
let p1TimeEnteredState = 0;
let p2TimeEnteredState = 0;

let lastStateUpdate = 0;

const minMoveTime = 500;

const SLAP_COOLDOWN = 500;
const BLOCK_COOLDOWN = 250;



const p1SlapKeyCode     = ' ';
const p1DodgeKeyCode    = 'Control';
const p1FeigntKeyCode   = 'q';
const p1GetReadyKeyCode = 'Shift';

function keyboard_callback(e) {
    // console.log("e: ", e);

    if (e.key === p1SlapKeyCode) {           //space
        p1.State = TRY_SLAP_STATE;
    }
    else if (e.key === p1GetReadyKeyCode) {  //shift
        p1.State = IDLE_STATE;
        // console.log("Ready?");
        //play Ready animation
        //cannot dodge when Ready
    }
    else if (e.key === p1DodgeKeyCode) {     //ctrl
        p1.State = DODGE_STATE;
        //if in Ready, return to UnReady? (base state?)
        //if in UnReady?(base state), play dodge animation
    }
}



//random slapping AI
function TrySlap(player) {
    if (player == "p1") {
        const dt = performance.now() - p1TimeEnteredState;
        if (p1State == IDLE_STATE && dt > SLAP_COOLDOWN) {
            p1State = TRY_SLAP_STATE;
            p1TimeEnteredState = performance.now();

            console.log('Player1 attempting slap.');
        }
        else {
            console.log('Player1 cannot slap right now.');
        }
    } else {     //p2
        const dt = performance.now() - p2TimeEnteredState;
        if (p2State == IDLE_STATE && dt > SLAP_COOLDOWN) {
            p2State = TRY_SLAP_STATE;
            p2TimeEnteredState = performance.now();

            console.log('Player2 attempting slap.');
        }
    }
}

function Dodge(player) {
    animateDodge(player);
}

function GotSlapped(player) {
    // console.log("player: ", player);

    player.SlapCount++;
    player.ScoreDiv.innerHTML = `Player ${player.player} Score: ${player.SlapCount}`;
}

function updateState(time) {
    // console.log('Inside updateState, p1State: ', p1State, ', p2State: ', p2State);

    p1.sprite = characters[levelSelect.value].sprite;
    p1.spriteW = characters[levelSelect.value].sprite_w;
    p1.x      = characters[levelSelect.value].p1_X;
    p1.w      = characters[levelSelect.value].p1_W;
    p1.slapX  = characters[levelSelect.value].p1_SlapX;
    p1.dodgeX = characters[levelSelect.value].p1_DodgeX;
    p1.dodgeV = characters[levelSelect.value].p1_DodgeVec;

    p2.sprite = characters[levelSelect.value].sprite;
    p2.spriteW = characters[levelSelect.value].sprite_w;
    p2.x      = characters[levelSelect.value].p2_X;
    p2.w      = characters[levelSelect.value].p2_W;
    p2.slapX  = characters[levelSelect.value].p2_SlapX;
    p2.dodgeX = characters[levelSelect.value].p2_DodgeX;
    p2.dodgeV = characters[levelSelect.value].p2_DodgeVec;

    if (p1.State === IDLE_STATE) {
        animateReady(p1);
    }
    if (p2.State === IDLE_STATE) {
        animateReady(p2);
    }

    if (p1.State === TRY_SLAP_STATE && p2.State === TRY_SLAP_STATE) {
        if (p2TimeEnteredState < p1TimeEnteredState) {
            GotSlapped(p2);
        } else {
            GotSlapped(p1);
        }
    }
    else if (p1.State === TRY_SLAP_STATE) {
        console.log("state: ", p1.State);
        if (p2.State === SLAPPING_STATE) {
            console.log('Player2 already being slapped by Player1.');
        }
        else if (p2.State === DODGE_STATE) {
            Dodge(p2);
        }
        else if (p2.State === IDLE_STATE) {
            p1.State = SLAPPING_STATE;
            GotSlapped(p1);
        }
    }
    else if (p2.State === TRY_SLAP_STATE) {
        if (p1.State === SLAPPING_STATE) {
            console.log('Player1 already being slapped by Player2.');
        }
        else if (p1.State === DODGE_STATE) {
            Dodge(p1);
        }
        else if (p1.State === IDLE_STATE) {
            p2.State = SLAPPING_STATE;
            GotSlapped(p2);
        }
    }
    else if (p1.State === SLAPPING_STATE) {
        console.log("p1 slapping state");
        animate_slap(p1,time);
    }
    else if (p2.State === SLAPPING_STATE) {
        console.log("p2 slapping state");
        animate_slap(p2,time);
    }
}


const fps_div = document.getElementById("fps");
let tickTimeoutId;
let lastFrame = 0;
function render_loop(time) {
    // if (Math.random() < 0.2) {
    //     console.log('calling p2TrySlap');
    //     TrySlap("p2");
    // }
    // console.log('calling updateState');


    let diff = time - lastFrame;
    // console.log("diff: ", diff);

    let fps = 1/(diff/1000);
    fps_div.innerText = `FPS: ${fps}`;
    lastFrame = time;

    updateState(time);

    requestAnimationFrame(render_loop);


}

render_loop();