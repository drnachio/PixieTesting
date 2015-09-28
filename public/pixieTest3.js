var stats = new Stats();
//stats.setMode(2);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
document.body.appendChild( stats.domElement );


var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {antialias: false});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
stage.interactive = true;

var totalCols = 100;
var containers = [];

var totalSegs = 5;
var downValues = [];
var upValues = [];
var height = window.innerHeight;
var mid = height/2;
var width = window.innerWidth;
var mHeight = height / totalSegs;

PIXI.loader.add('rule', 'images/layout_grid.png').load(function(loader,resources){
	var texture = resources.rule.texture;
	var bg = new PIXI.extras.TilingSprite(texture, renderer.width, renderer.height);
	stage.addChild(bg);

	window.onresize = function()
	{
		PIXI.width = window.innerWidth;
		PIXI.height = window.innerHeight;
		bg.width = window.innerWidth;
		bg.height = window.innerHeight;
	};

	for (var i=0;i<totalCols ;i++)
	{
		var up =[];
		var down =[];

		for (var j=0;j<totalSegs ;j++)
		{
			up.push({val:0,cur:0,spd:0});
			down.push({val:0,cur:0,spd:0});
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

	stage.interactive = true;

	for (var i=0;i<totalCols ;i++) {

		var column = new PIXI.Container();
		var prev = null;
		for (var j=totalSegs-1;j>=0;j--) {
			var container = new PIXI.Container();
			container.graphics = new PIXI.Graphics();
			container.tag = upValues[i][j];
			container.ocol = container.col = ingresos[j%10];
			container.prev = prev;

			container.getY = function()
			{
					return this.tag.cur + (this.prev?this.prev.getY():0);
			};

			container.refresh = function(){
				this.graphics.clear().beginFill(this.col, 1).drawRect(0, 0, stepWidth, 1);
			};

			container.interactive = true;

			container.mouseover = function()
			{
				this.col = 0x000000;
				this.refresh();
			};

			container.mouseout = function()
			{
				this.col = this.ocol;
				this.refresh();
			};

			container.refresh();
			containers.push(container);
			container.addChild(container.graphics);
			column.addChild(container);
			prev = container;
		}

		column.x = i * step + stepWidth *0.2;
		column.y = mid - container.getY();
		column.lastBlock = container;
		stage.addChild(column);

		var column = new PIXI.Container();
		var prev = null;
		for (var j=totalSegs-1;j>=0;j--) {
			var container = new PIXI.Container();
			container.graphics = new PIXI.Graphics();
			container.tag = downValues[i][j];
			container.ocol = container.col = gastos[j%10];
			container.prev = prev;

			container.getY = function()
			{
				return this.tag.cur + (this.prev?this.prev.getY():0);
			};

			container.refresh = function(){
				this.graphics.clear().beginFill(this.col, 1).drawRect(0, 0, stepWidth, 1);
			};

			container.interactive = true;

			container.mouseover = function()
			{
				this.col = 0x000000;
				this.refresh();
			};

			container.mouseout = function()
			{
				this.col = this.ocol;
				this.refresh();
			};

			container.refresh();
			containers.push(container);
			container.addChild(container.graphics);
			column.addChild(container);
			prev = container;
		}

		column.x = i * step + stepWidth *0.2;
		column.y = mid;
		column.lastBlock = container;
		stage.addChild(column);
	}


	requestAnimationFrame(animate);

	function animate() {
		stats.begin();

		if(cursor < totalCols)
		{
			for (var j=0;j<totalSegs ;j++)
			{
				downValues[cursor][j].val=Math.floor((Math.random() * mHeight / 2.4));
				upValues[cursor][j].val=  -1 * Math.floor((Math.random() * mHeight / 2.4));
			}
			cursor++;
			setTimeout(addRandomValue,100);
		}


		renderer.render(stage);

		for(var key in mousePos) {
			mousePosSpeed[key] -= (bg.tilePosition[key] - mousePos[key]) / 200;
			bg.tilePosition[key] += mousePosSpeed[key];
			mousePosSpeed[key] *= 0.92;
		}

		for (var i=0;i<containers.length;i++) {
			var cont= containers[i];

			if (cont.tag.cur != cont.tag.val || (cont.prev && cont.prev.invalidate)) {
				var delta = cont.tag.cur - cont.tag.val;
				cont.tag.spd -= delta / 100;
				cont.tag.cur += cont.tag.spd;
				cont.tag.spd *= 0.90;
				if(Math.abs(cont.tag.spd) < 1 && Math.abs(delta) <1)
				{
					cont.tag.cur = cont.tag.val;
				}
				cont.height = cont.tag.cur;
				cont.invalidate = true;
				cont.y = (cont.prev ? cont.prev.getY() : 0);
			}
			else{
				cont.invalidate = false;
			}
		}

		stats.end();
		requestAnimationFrame(animate);
	};


});
var mousePos = {x:0,y:0};
var mousePosSpeed = {x:0,y:0};

function handleMouseMove(event) {
	var dot, eventDoc, doc, body, pageX, pageY;

	event = event || window.event; // IE-ism

	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (event.pageX == null && event.clientX != null) {
		eventDoc = (event.target && event.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		event.pageX = event.clientX +
			(doc && doc.scrollLeft || body && body.scrollLeft || 0) -
			(doc && doc.clientLeft || body && body.clientLeft || 0);
		event.pageY = event.clientY +
			(doc && doc.scrollTop  || body && body.scrollTop  || 0) -
			(doc && doc.clientTop  || body && body.clientTop  || 0 );
	}

	mousePos = {
		x: event.pageX,
		y: event.pageY
	};
}

document.onmousemove = handleMouseMove;

document.onclick = function()
{
	for (var i=0;i<totalCols ;i++)
	{
		for (var j=0;j<totalSegs ;j++)
		{
			downValues[i][j].val=Math.floor((Math.random() * mHeight / 2.4));
			upValues[i][j].val=  -1 * Math.floor((Math.random() * mHeight / 2.4));
		}
	}
};

var cursor = 0;

function addRandomValue()
{
	if(cursor < totalCols)
	{
		for (var j=0;j<totalSegs ;j++)
		{
			downValues[cursor][j].val=Math.floor((Math.random() * mHeight / 2.4));
			upValues[cursor][j].val=  -1 * Math.floor((Math.random() * mHeight / 2.4));
		}
		cursor++;
		setTimeout(addRandomValue,100);
	}
}

setTimeout(addRandomValue,100);
