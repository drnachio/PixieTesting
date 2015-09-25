var stats = new Stats();
//stats.setMode(2);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );

window.onresize = function()
{
	PIXI.width = window.innerWidth;
	PIXI.height = window.innerHeight;
	bg.width = window.innerWidth;
	bg.height = window.innerHeight;
};

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
stage.interactive = true;

var bg = PIXI.Sprite.fromImage('images/fondo.jpg');
bg.width = window.innerWidth;
bg.height = window.innerHeight;
stage.addChild(bg);
var downValues = [];
var upValues = [];
var totalCols = 100;
var totalSegs = 5;
var height = window.innerHeight;
var mid = height/2;
var width = window.innerWidth;

var mHeight = height / totalSegs;

for (var i=0;i<totalCols ;i++)
{
	var up =[];
	var down =[];

	for (var j=0;j<totalSegs ;j++)
	{
		up.push(Math.floor((Math.random() * mHeight / 2.4) + 10));
		down.push(Math.floor((Math.random() * mHeight / 2.4) + 10));
	}

	downValues.push(down);
	upValues.push(up);
}

var step = width / totalCols;
var stepWidth = step*0.8;
var blocks = [];
var gastos = [[224, 125, 40], [199, 59, 10], [122, 14, 1], [240, 197, 66], [232, 161, 55], [212, 106, 30], [188, 189, 132], [151, 142, 67], [118, 79, 10], [193, 121, 83], [156, 47, 16], [51, 15, 1], [193, 63, 71], [116, 17, 20], [157, 41, 64], [229, 56, 58]];
var ingresos = [[90,189,160],[52,144,129],[139,208,180],[33,100,93],[48,157,48],[25,82,63],[116,183,28],[39,133,39],[154,209,64],[29,168,129],[193,225,149],[109,187,39],[29,168,129],[59,122,175],[127,193,215],[175,224,231]];

for(var i=0;i<gastos.length;i++)
{
	gastos[i] = gastos[i][2] + gastos[i][1] * 256 + gastos[i][0] * 65536;
	ingresos[i] = ingresos[i][2] + ingresos[i][1] * 256 + ingresos[i][0] * 65536;
}


for (var i=0;i<totalCols ;i++) {
	var graphics = new PIXI.Graphics();
	var lasty = mid;

	var mask = PIXI.Sprite.fromImage('images/mask.png');
	mask.position.x = 0;
	mask.width = stepWidth;
	mask.height = mid;

	for (var j=0;j<totalSegs ;j++) {
		graphics.beginFill(ingresos[j], 1);
		graphics.drawRect(0, lasty, stepWidth, upValues[i][j] * -1);
		lasty -= upValues[i][j];
	}

	mask.position.y = lasty;
	graphics.x = i * step;
	mask.position.x = graphics.x;
	graphics.mask = mask;
	stage.addChild(graphics);
	stage.addChild(mask);

	graphics = new PIXI.Graphics();
	var lasty = mid;
	for (var j=0;j<totalSegs ;j++) {
		graphics.beginFill(gastos[j], 1);
		graphics.drawRect(i * step, lasty, stepWidth, upValues[i][j]);
		lasty+=upValues[i][j];
	}
	stage.addChild(graphics);
}


/*cells.mask = mask;
stage.addChild(mask);
stage.addChild(cells);*/



requestAnimationFrame(animate);

function animate() {
	stats.begin();
	renderer.render(stage);
	stats.end();
	requestAnimationFrame(animate);
};