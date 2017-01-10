import _ from 'lodash';

function _group_schema(){
	return {
		attributes:{},
		style:{
			fill: 	{type:"colour", description:"fill colour"},
			stroke: {type:"colour", description:"stroke colour"},
			"stroke-width": {type:"number", description:"stroke width"},
			opacity: {type:"number", description:"opacity from 0 (transparent) to 1 (opaque)"},
		}
	}
}

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


function _ellipse_schema(){
	return {
		
		attributes:{
			cx: {type:"number", description:"x coordinate of circle center"},
			cy: {type:"number", description:"y coordinate of circle center"},
			rx: {type:"number", description:"circle x radius (px)"},
			ry: {type:"number", description:"circle y radius (px)"},
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

function _ellipse(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `ellipse:${id}`,
		type: "ellipse",
		cx: x,
		cy: y,
		rx: 40,
		ry: 30,
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
			stroke: 'none',
			'stroke-width': 1,
			opacity: 1,
			'text-decoration': 'none',
			'font-weight': 'normal',
			'font-size': 10,
			'font-style': 'normal',
		}
	}
}


function _group(x:number, y:number, children){
	const id =generateId();
	return {
		id,
		label: `group:${id}`,
		type: "group",
		x: x,
		y: y,
		children,
		style:{
			fill: 'none',
			stroke: 'none',
			opacity: 1,
			'stroke-width': 0,
		}
	}
}

export function typeForProperty(type, property){
	const schema = schemaLookup(type);
	
	if (schema){
		if (schema.attributes[property])
			return schema.attributes[property].type;
		if (schema.style[property])
			return schema.style[property].type;
	}
	return "unknown";
}

export function schemaLookup(type){
	switch (type){
		case "line":
			return _line_schema();

		case "rect":
			return _rect_schema();

		case "circle":
			return _circle_schema();

		case "ellipse":
			return _ellipse_schema();

		case "text":
			return _text_schema();

		case "group":
			return _group_schema();

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
		
		case "ellipse":
			return _ellipse(x,y);

		case "text":
			return _text(x,y);

		default:
			return null;
	}
}

export function createGroupTemplate(children, x:number, y:number){
	return _group(x,y,children);

}

export function originForNode(node){

	switch (node.type){

		case "line":
			return {x:node.x1, y:node.y1}

		case "text":
		case "rect":
			return {x:node.x, y:node.y}

		case "ellipse":
		case "circle":
			return {x:node.cx, y:node.cy}

		default:
			return null;
	}
}

export function scalePreservingOrigin(x,y,sf){
	//return `translate(${node.cx},${node.cy}) scale(${sf}) translate(${-node.cx},${-node.cy})`
	return `scale(${sf}) translate(${-(x - (x/sf))},${-(y - (y/sf))})`
}

export function camelise(style){
	
	style = style || {};

	return Object.keys(style).reduce((acc,key)=>{
		acc[_.camelCase(key)] = style[key];
		return acc;
	},{});

}

export function componentsFromTransform(a)
{
    var b={};
    for (var i in a = a.match(/(\w+\((\-?\d+\.?\d*e?\-?\d*,?)+\))+/g))
    {
        var c = a[i].match(/[\w\.\-]+/g);
        b[c.shift()] = c;
    }
    return b;
}

export function templateForPath(path, templates)
{
  if (path.length <= 0){
    return null;
  }

  const [id, ...rest] = path;

  if (path.length == 1){
    return templates[id]
  }

  return templateForPath(rest, templates[id].children);
}

export function generateId(){
	return (1+Math.random()*4294967295).toString(16);
}

