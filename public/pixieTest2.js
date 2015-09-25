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

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: true});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
stage.interactive = true;
var texture = PIXI.Texture.fromImage('images/lead-28b.jpg');
var bg = new PIXI.extras.TilingSprite(texture, renderer.width, renderer.height);
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
		up.push(Math.floor((Math.random() * mHeight / 2.4)));
		down.push(Math.floor((Math.random() * mHeight / 2.4)));
	}

	downValues.push(down);
	upValues.push(up);
}

var step = width / totalCols;
var stepWidth = step*0.6;
var blocks = [];
var gastos = [[224, 125, 40], [199, 59, 10], [122, 14, 1], [240, 197, 66], [232, 161, 55], [212, 106, 30], [188, 189, 132], [151, 142, 67], [118, 79, 10], [193, 121, 83], [156, 47, 16], [51, 15, 1], [193, 63, 71], [116, 17, 20], [157, 41, 64], [229, 56, 58]];
var ingresos = [[90,189,160],[52,144,129],[139,208,180],[33,100,93],[48,157,48],[25,82,63],[116,183,28],[39,133,39],[154,209,64],[29,168,129],[193,225,149],[109,187,39],[29,168,129],[59,122,175],[127,193,215],[175,224,231]];

for(var i=0;i<gastos.length;i++)
{
	gastos[i] = gastos[i][2] + gastos[i][1] * 256 + gastos[i][0] * 65536;
	ingresos[i] = ingresos[i][2] + ingresos[i][1] * 256 + ingresos[i][0] * 65536;
}


for (var i=0;i<totalCols ;i++) {

	var lasty = 0;
	var container = new PIXI.Container();
	var graphics = new PIXI.Graphics();
	for (var j=totalSegs-1;j>=0;j--) {
		graphics.beginFill(ingresos[j%10], 1);
		graphics.drawRect(0, lasty, stepWidth, upValues[i][j] );
		lasty += upValues[i][j];
	}
	container.addChild(graphics);

	var texture = new PIXI.RenderTexture(renderer, stepWidth, lasty);
	texture.render(container);

	var graphicsB = new PIXI.Graphics();
	graphicsB.beginFill(ingresos[0], 1);
	//graphicsB.drawRect(i * step + stepWidth *0.2, mid - (lasty-stepWidth/2.2-1), stepWidth, lasty-stepWidth/2.2-1);
	graphicsB.drawOneSideRoundedRect(i * step + stepWidth *0.2, mid - lasty, stepWidth, lasty, stepWidth/2.2, PIXI.POSITION.TOP);

	var sprite = new PIXI.Sprite(texture);
	sprite.mask = graphicsB;
	sprite.x = i * step + stepWidth *0.2;
	sprite.y = mid - lasty;

	stage.addChild(sprite);

	lasty = 0;
	container = new PIXI.Container();
	graphics = new PIXI.Graphics();

	for (var j=0;j<totalSegs ;j++) {
		graphics.beginFill(gastos[j%10], 1);
		graphics.drawRect(0, lasty, stepWidth, downValues[i][j] );
		lasty += downValues[i][j];
	}
	container.addChild(graphics);


	texture = new PIXI.RenderTexture(renderer, stepWidth, lasty);
	texture.render(container);

	graphicsB = new PIXI.Graphics();
	graphicsB.beginFill(gastos[0], 1);
	//graphicsB.drawRect(i * step + stepWidth *0.2, mid, stepWidth, lasty-stepWidth/2.2);
	graphicsB.drawOneSideRoundedRect(i * step + stepWidth *0.2, mid, stepWidth, lasty,stepWidth/2.2, PIXI.POSITION.BOTTOM);


	var sprite = new PIXI.Sprite(texture);

	sprite.mask = graphicsB;


	sprite.x = i * step + stepWidth *0.2;
	sprite.y = mid;

	stage.addChild(sprite);
}


requestAnimationFrame(animate);
var t =0;
function animate() {
	stats.begin();
	t++;
	renderer.render(stage);
	bg.tilePosition.x = 600 * Math.cos(t/130);
	bg.tilePosition.y = 600 * Math.sin(t/133);
	stats.end();
	requestAnimationFrame(animate);
};