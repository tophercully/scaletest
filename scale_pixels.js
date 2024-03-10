/*
Create a canvas 'C' with a 2d context 'X'.
Draw a Sierpinsky triangle and a checkerboard pattern on the canvas.
The purpose is to check if the image looks identical on every device.

Dimensions of the canvas are set to fixed values, for example 1152 * 1152 pixels,
so on every device, when saving the image, you would save the exact same image.

This way, all calculations in the code can be done with values that are set at the start.
For example WIDTH = HEIGHT = 2048. And you don't have to do additional scaling calculations for every single pixel.

All global constants use CAPITAL case, as I used that in Python. And I like the canvas (C), context (X), and WIDTH / HEIGHT to be like this
Even the MARGIN can be fixed in pixels in this case. But I probably want to change this to 0.03 * WIDTH or something like that

*/

C=window.document.body.appendChild(window.document.createElement("canvas"));
X=C.getContext("2d");
S=1;  // this is a seed for the PRNG (line below). In this example, use a fixed seed, so every output will be identical
R=_=>(S^=S<<13,S^=S>>17,S^=S<<5,(S<0?1+~S:S)%999/999)  // ignore how this works, it generates 'random' values, but I recommend to use other PRNG that are well tested.

// by default, draw a 9x9 checkerboard, 1152 x 1152 pixels, but 16:9 or 9:16 ratio is supported as well
SHORT_SIDE = new URLSearchParams(window.location.search).get('short_side') || 1152;  // because 1152 * 16 / 9 = 2048
HEIGHT=SHORT_SIDE;
WIDTH=SHORT_SIDE;
CELLS_PER_ROW = 9;
CELLS_PER_COLUMN = 9;
// but in case the aspect ratio is portrait or landscape, make it 16x9 or 9x16;
MODE = new URLSearchParams(window.location.search).get('mode') || 'default';
if (MODE==='portrait'){
    CELLS_PER_COLUMN = 16;
    HEIGHT=(SHORT_SIDE * 16 / 9)|0;
} else if (MODE==='landscape') {
    CELLS_PER_ROW = 16;
    WIDTH=(SHORT_SIDE * 16 / 9)|0;
}

MARGIN = 0.03 * Math.min(WIDTH,HEIGHT)|0;
STEP_X = (WIDTH-2*MARGIN)/CELLS_PER_ROW;
STEP_Y = (HEIGHT-2*MARGIN)/CELLS_PER_COLUMN;


C.width=WIDTH;
C.height=HEIGHT;
// C.style = "position:absolute; display:block; bottom:0; top:0; left:0; right:0; width:auto; margin:auto; height:100%";
document.body.style.background = 'lightblue';

X.fillStyle='#444';
X.fillRect(0,0,WIDTH, HEIGHT);
X.fillStyle='#fff';


drawCheckerboard=_=>{
    for (let x=0; x<CELLS_PER_ROW; x++){
        for (let y=0; y<CELLS_PER_COLUMN; y++){
            if ((x+y)%2===0){
                X.fillRect(MARGIN+ x*STEP_X,MARGIN+y*STEP_Y,STEP_X, STEP_Y);
            }
        }
    }
}


drawChaosGame=(vertices, color)=>{
    let pixelSize = SHORT_SIDE / 600;
    let halfPixelSize = pixelSize / 2;
    X.fillStyle = color;
    let startVertex = [0, 0];
    for (let i=0; i<99999; i++) {
        let randomVertex = vertices[R() * vertices.length|0];
        let midpoint = [0,1].map(k=>(randomVertex[k] + startVertex[k]) / 2 - halfPixelSize);
        X.fillRect(...midpoint, pixelSize, pixelSize);
        startVertex = midpoint;
    }
}


getTriangleVertices=_=>{
    let bottomY = HEIGHT - MARGIN - STEP_Y / 2;
    let topY = MARGIN + STEP_Y / 2;
    let leftX = MARGIN + STEP_X / 2;
    let rightX = WIDTH - MARGIN - STEP_X / 2;
    let topX = WIDTH / 2;

    if (MODE==='portrait'){
        bottomY = HEIGHT - MARGIN - 4.5 * STEP_Y;
        topY = MARGIN + 3.5*STEP_Y;
    } else if (MODE==='landscape') {
        topX += STEP_X / 2;
        leftX += 4*STEP_X;
        rightX -= 3*STEP_X;
    }

    return [
        [leftX,bottomY],
        [topX,topY],
        [rightX,bottomY]
    ];
}

getSquareVertices=_=>{
    let topY = MARGIN;
    let bottomY = HEIGHT - MARGIN;
    let leftX = MARGIN;
    let rightX = WIDTH - MARGIN;

    if (MODE==='portrait'){
        bottomY = HEIGHT - MARGIN - 4 * STEP_Y;
        topY = MARGIN + 3*STEP_Y;
    } else if (MODE==='landscape') {
        leftX += 4*STEP_X;
        rightX -= 3*STEP_X;
    }

    return [
        [leftX, topY],
        [rightX, topY],
        [leftX, bottomY],
        [rightX, bottomY],
    ]
}


TRIANGLE = getTriangleVertices();
SQUARE = getSquareVertices();

drawCheckerboard();
drawChaosGame(SQUARE, 'red');
drawChaosGame(TRIANGLE, 'black');
