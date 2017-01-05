
function _circle_schema(){
	return {
		
		attributes:{
			cx: {type:"number", description:"x coordinate of circle center"},
			cy: {type:"number", description:"y coordinate of circle center"},
			r: {type:"number", description:"circle radius (px)"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _line_schema(){
	return {
		
		attributes:{
			x1: {type:"number", description:"x coordinate of first point"},
			x2: {type:"number", description:"x coordinate of last point"},
			y1: {type:"number", description:"y coordinate of first point"},
			y2: {type:"number", description:"y coordinate of last point"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _rect_schema(){
	return {
		
		attributes:{
			x: {type:"number", description:"x coordinate of left most position of the rect"},
			y: {type:"number", description:"y coordinate of top most position of the rect"},
			width: {type:"number", description:"rect width"},
			height: {type:"number", description:"rect height"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

function _text_schema(){
	return {
		
		attributes:{
			x: {type:"number", description:"x coordinate of left most position of the text"},
			y: {type:"number", description:"y coordinate text baseline"},
			text: {type:"string", description:"the text"},
		},
		
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
			"text-decoration": {type:"string", description: "text decoration", enum:["none", "underline", "overline", "line-through","blink"]},
			"font-weight": {type:"string", description:"font weight", enum:["normal","bold","bolder","lighter"]},
			"font-size":{type:"number", description:"size of the text (px)"},
			"font-style":{type:"string", description:"font style", enum:["normal","italic","oblique"]}
		}
	}
}



function _circle(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `circle:${id}`,
		type: "circle",
		cx: x,
		cy: y,
		r: 30,
		style:{
			fill:'black',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
	}
}

function _line(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `line:${id}`,
		type: "line",
		x1: x,
		x2: x + 30,
		y1: y,
		y2: y,
	}
}

function _rect(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `rect:${id}`,
		type: "rect",
		x: x,
		y: y,
		width: 40,
		height: 20,
	}
}

function _text(x:number, y:number){
	const id =generateId();
	return {
		id,
		label: `text:${id}`,
		type: "text",
		x: x,
		y: y,
		text: "your text",
		style:{
			fill:'black',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
			'text-decoration': 'none',
			'font-weight': 'normal',
			'font-size': '1em',
			'font-style': 'normal',
		}
	}
}


export function schemaLookup(type){
	switch (type){
		case "line":
			return _line_schema();

		case "rect":
			return _rect_schema();

		case "circle":
			return _circle_schema();

		case "text":
			return _text_schema();

		default:
			return null;
	}
}

export function createTemplate(type:string, x:number, y:number){
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

export function generateId(){
	return (1+Math.random()*4294967295).toString(16);
}

