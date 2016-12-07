function _generateid(){
	return (1+Math.random()*4294967295).toString(16);
}

function _circle(x:number,y:number){
	return {
		id: _generateid(),
		type: "circle",
		cx: x,
		cy: y,
		r: 30,
	}
}

function _line(x:number,y:number){
	return {
		id: _generateid(),
		type: "line",
		x1: x,
		x2: x + 30,
		y1: y,
		y2: y,
	}
}

function _rect(x:number,y:number){
	return {
		id: _generateid(),
		type: "rect",
		x: x,
		y: y,
		width: 40,
		height: 20,
	}
}

function _text(x:number, y:number){
	return {
		id: _generateid(),
		type: "text",
		x: x,
		y: y,
		text: "your text",
	}
}

export function createShape(type:string, x:number, y:number){
	switch (type){
		case "line":
			return _line(x,y);

		case "rect":
			return _rect(x,y);

		case "circle":
			return _circle(x,y);

		case "text":
			return _text(x,y);

		default:
			return null;
	}
}

