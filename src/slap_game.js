document.addEventListener("keydown", keyboard_callback);
const canvas = document.getElementById("canvas");
const ctx    = canvas.getContext("2d");

/*          tvJosh          */
let p1ScoreDiv;
let p2ScoreDiv;
document.addEventListener("load",()=>{
    // p1Div = document.getElementById('p1_msg');
    // p2Div = document.getElementById('p2_msg');
    // p1StateDiv = document.getElementById('p1_state');
    // p2StateDiv = document.getElementById('p2_state');
    p1ScoreDiv = document.getElementById('p1_score');
    p2ScoreDiv = document.getElementById('p2_score');
}, 1000);
/*          end         */



let p1 = {
    "State" : "Base",   //UnReady?
    "Anim"  : 0,
    "Timer" : 0
};
let p2 = {
    "State" : "Base",   //UnReady?
    "Anim"  : 0,
    "Timer" : 0
};

const slapCooldown  = 1000;
const dodgeCooldown = 1000;

const WillSmith = {
    "sprite" : "../resources/Will_Smith_slap_spritesheet.png",
    "width"  : 410,
    "p1_Offset" : 0,
    "p2_Offset" : 410/2.5,
    "p1_Width"  : 410 - (410/2.5),
    "p2_Width"  : 410 - (410/2.5),

    "p1_Slap"  : 410*3,
    "p2_Slap"  : 410/2.5,

    "p1_Dodge" : 410/2.5,
    "p2_Dodge" : 410/2.5,
    "p1_DodgeVec"   : +30,
    "p2_DodgeVec"   : -30
};
const characters = [
    WillSmith,
];




ctx.fillStyle = "green";        //Base/UnReady
ctx.fillRect(10,10,150,100);


let slap_image = new Image();
slap_image.src = characters[0].sprite;
ctx.drawImage(
    slap_image,
    0,0,
    characters[0].width, slap_image.height,
    0,0,
    characters[0].width, slap_image.height,
);

function slap(player,level,idx) {
    console.log("animating slap");
    let offset = idx*characters[level].width;
    if (offset > slap_image.width) {
        return;
    }
    ctx.clearRect(
        characters[level].p1_Offset,0,
        characters[level].p1_Width,canvas.height
    );
    ctx.drawImage(
        slap_image,                                 //image
        characters[level].p1_Slap+offset,0,               //sx,sy
        characters[level].width, slap_image.height,    //sw,sh

        characters[level].p1_Offset,0,                 //dx,dy
        characters[level].p1_Width, slap_image.height  //dw,dh
    );
    setTimeout(()=>{slap(player,level,idx+1)},200);
}

function animate_slap(player, level) {
    slap_image.src = characters[level].sprite;
    // console.log("animating slap");

    if (player == "p1") {
        p1.State = "Slap";
        slap("p1",0,0);
    } else {     //p2
        p2.State = "Slap";
        slap("p2",0,0);
    }

    setTimeout(()=>{animate_base(level)}, slapCooldown);
    console.log(`Slap Cooldown: ${slapCooldown/1000}s`);
}
function animate_ready(level) {
    state = "Ready";
    slap_image.src = characters[level].sprite;
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    );
    ctx.drawImage(
        slap_image,
        characters[level].width,0,
        characters[level].width, slap_image.height,
        0,0,
        characters[level].width, slap_image.height,
    );
}
function animate_base(level) {
    // console.log("level: ", level);
    // console.log("Width: ", characters[level].width);
    slap_image.src = characters[level].sprite;
    state = "Base";
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    )
    ctx.drawImage(
        slap_image,
        0,0,
        characters[level].width, slap_image.height,
        0,0,
        characters[level].width, slap_image.height
    );
}
function animate_dodge(player, level) {
    state = "Dodge";
    slap_image.src = characters[level].sprite;
    ctx.clearRect(
        0,0,
        canvas.width,
        canvas.height
    )

    if (player == "p1") {
        ctx.drawImage(
            slap_image,
            0,0,
            characters[level].player1Dodge, slap_image.height,
            characters[level].p1_DodgeVec,0,
            characters[level].p1_Dodge,
            slap_image.height/2
        );
    } else {    //p2
        ctx.drawImage(
            slap_image,
            0,0,
            characters[level].player2Dodge, slap_image.height,
            characters[level].p2_DodgeVec,0,
            characters[level].p2_Dodge,
            slap_image.height/2
        );
    }

    // setTimeout(()=>{animate_base(level)}, dodgeCooldown);
    // timeoutCallback(level, dodgeCooldown);
    setTimeout(()=>{animate_base(level)},dodgeCooldown);
    console.log(`Dodge Cooldown: ${dodgeCooldown/1000}s`);
}

let keyPressed = 0;

// function keyboard_callback(e) {
//     console.log("e: ", e);
//     keyPressed = e.keyCode;
//     animateAction(e.keyCode,"player1");
// }

function animateAction(keyCode, player) {
    if (keyCode == 32) {      //space
        //play slap animation
        //can only slap when Ready?
        //can dodge immediately after slap?
        if (state == "Ready") {
            console.log("Slap!");
            animate_slap(player, 0);
        } else {
            console.log("Not Ready!");
        }
    }
    if (keyCode == 16) {      //shift
        console.log("Ready?");
        //play Ready animation
        //cannot dodge when Ready
        animate_ready(0);
    }
    if (keyCode == 17) {      //ctrl
        //if in Ready, return to UnReady? (base state?)
        //if in UnReady?(base state), play dodge animation
        if (state == "Ready") {
            console.log("UnReady?");
            animate_base(0);
        } else {
            console.log("Dodge?");
            animate_dodge(0);
        }
    }
}



/*          tvJosh          */
const TRY_SLAP_STATE = 0;
const SLAPPING_STATE = 1;
const DODGE_STATE    = 2;
const IDLE_STATE     = 3;

let p1State = IDLE_STATE;
let p2State = IDLE_STATE;

let p1TimeEnteredState = 0
let p2TimeEnteredState = 0

let lastStateUpdate = 0;

const minMoveTime = 500;

const SLAP_COOLDOWN = 500;
const BLOCK_COOLDOWN = 250;

let p1SlappedCount = 0;
let p2SlappedCount = 0;

const p1SlapKeyCode     = ' ';
const p1DodgeKeyCode    = 'Control';
const p1FeigntKeyCode   = 'q';
const p1GetReadyKeyCode = 'Shift';

function keyboard_callback(e) {
    // console.log("e: ", e);

    if (e.key === p1SlapKeyCode) {
        p1State = TRY_SLAP_STATE;
        // TrySlap("p1");
    }
    else if (e.key === p1GetReadyKeyCode) {      //shift
        p1State = IDLE_STATE;
        // console.log("Ready?");
        //play Ready animation
        //cannot dodge when Ready
        // animate_ready(0);
    }
    else if (e.key === p1DodgeKeyCode) {      //ctrl
        p1State = DODGE_STATE;
        //if in Ready, return to UnReady? (base state?)
        //if in UnReady?(base state), play dodge animation
        // if (state == "Ready") {
        //     animate_dodge("p1",0);
        // }
    }
    updateState();
}




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
    if (player == "p1") {
        // p2Div.innerHTML = 'Player2 dodged.';
        console.log("Player1 dodged.");
        animate_dodge("p1",0);
    } else {     //p2
        // p1Div.innerHTML = 'Player1 dodged.';
        console.log("Player2 dodged.");
        animate_dodge("p2",0);
    }
    Reset("p1");
    Reset("p2");
}

function GotSlapped(player) {
    console.log("player: ", player);
    Reset("p1");
    Reset("p2");
    if (player == "p1") {
        p1SlappedCount += 1;
        p2ScoreDiv.innerHTML = p1SlappedCount;
        console.log("Player1 Got Slapped.");
        animate_slap("p1",0);
    } else {    //p2
        p2SlappedCount += 1;
        p1ScoreDiv.innerHTML = p2SlappedCount;
        console.log("Player2 Got Slapped.");
        animate_slap("p2",0);
    }
}

function Reset(player) {
    if (player == "p1") {
        p1State = IDLE_STATE;
        p1TimeEnteredState = performance.now();
    } else {     //p2
        p2State = IDLE_STATE;
        p2TimeEnteredState = performance.now();
    }
    animate_base(0);    //TODO: reset both? or just 1?
}

function updateState() {
    if (performance.now() - lastStateUpdate < minMoveTime) return;

    lastStateUpdate = performance.now();

    // console.log('Inside updateState, p1State: ', p1State, ', p2State: ', p2State);

    if (p1State === TRY_SLAP_STATE && p2State === TRY_SLAP_STATE) {
        if (p2TimeEnteredState < p1TimeEnteredState) {
            GotSlapped("p1");
        } else {
            GotSlapped("p2");
        }
    }
    else if (p1State === TRY_SLAP_STATE) {
        if (p2State === SLAPPING_STATE) {
            // playerDiv.innerHTML = 'Player1 already being slapped by Player2.';
            console.log('Player1 already being slapped by Player2.');
        }
        else if (p2State === DODGE_STATE) {
            Dodge("p1");
        }
        else if (p2State === IDLE_STATE) {
            GotSlapped("p2");
        }
    }
    else if (p2State === TRY_SLAP_STATE) {
        if (p1State === SLAPPING_STATE) {
            // p2Div.innerHTML = 'Player2 already being slapped by Player1.';
            console.log('Player2 already being slapped by Player1.');
        }
        else if (p1State === DODGE_STATE) {
            Dodge("p1");
        }
        else if (p1State === IDLE_STATE) {
            GotSlapped("p1");
        }
    }
    else if (p1State === SLAPPING_STATE) {
        animate_slap("p1",0);
    }
    else if (p2State === SLAPPING_STATE) {
        animate_slap("p2",0);
    }
}


let tickTimeoutId;
// let p2State = 0;
// const willSheet = new Image(WillSmith_sprite);
// const willSheet = document.createElement('img');
// // willSheet.src = WillSmith_sprite;
// willSheet.src = WillSmith.sprite;
// const willSheetHeight = 457;
// const willSheetWidth = 6150;
// const willSheetXPositions = [
//     0, willSheetWidth / 15, 1 * willSheetWidth / 15, 2 * willSheetWidth / 15, 3 * willSheetWidth / 15, 4 * willSheetWidth / 15, 
//     5 * willSheetWidth / 15, 6 * willSheetWidth / 15, 7 * willSheetWidth / 15, 8 * willSheetWidth / 15, 9 * willSheetWidth / 15, 
//     10 * willSheetWidth / 15, 11 * willSheetWidth / 15, 12 * willSheetWidth / 15, 13 * willSheetWidth / 15, 14 * willSheetWidth / 15
// ]
// const willSheetDownsizeRatio = 1;

// document.getElementById('after_canvas').appendChild(willSheet);

function tick() {
    // if (Math.random() < 0.2) {
    //     console.log('calling p2TrySlap');
    //     TrySlap("p2");
    // }
    // console.log('calling updateState');
    updateState();

    // p2State += 1;
    // const p2SpriteNum = 13 + p2State % 2;
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(willSheet, 
    //     willSheetXPositions[p2SpriteNum], 0, willSheetWidth / 15, willSheetHeight, 
    //     0, 0, willSheetWidth / 15 * willSheetDownsizeRatio, willSheetHeight * willSheetDownsizeRatio
    // );
    // console.log('tick', p2State);
    tickTimeoutId = setTimeout(tick, tickFreq);
}

const tickFreq = 500;
tickTimeoutId = setTimeout(tick, tickFreq);