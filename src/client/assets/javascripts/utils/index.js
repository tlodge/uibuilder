import _ from 'lodash';
import {spring} from 'react-motion';

function _group_schema(){
	return {
		attributes:{
			x: {type:"number", description:"x translate"},
			y: {type:"number", description:"y translate"},
		},
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

function _path_schema(){
	return {
		
		attributes:{
			d: {type:"string", description:"svg path string"},
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
			rx: {type:"number", description:"rx rounding"},
			ry: {type:"number", description:"ry rounding"},
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
		r: 50,
		style:{
			fill:'white',
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
		ry: 60,
		style:{
			fill:'white',
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
		style:{
			fill:'none',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
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
		rx: 5,
		ry: 5,
		width: 60,
		height: 40,
		style:{
			fill:'white',
			stroke: 'black',
			'stroke-width': 1,
			opacity: 1,
		}
	}
}

function _path(x:number,y:number){
	const id =generateId();
	return {
		id,
		label: `path:${id}`,
		type: "path",
		d: `M ${x} ${y} ${x+100} ${y+50}`,
		style:{
			fill:'black',
			stroke: 'black',
			'stroke-width': 2,
			opacity: 1,
		}
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
			'font-size': 30,
			'font-style': 'normal',
		}
	}
}

function _group(x:number, y:number, children){
	const id =generateId();

	const bounds = _calculateBounds(children, Number.MAX_VALUE, -1, Number.MAX_VALUE, -1);
	
	return {
		id,
		label: `group:${id}`,
		type: "group",
		x: x,
		y: y,
		width: bounds.width,
		height: bounds.height,
		children,
		style:{
			fill: 'none',
			stroke: 'none',
			opacity: 1,
			'stroke-width': 0,
		}
	}
}


const _circleBounds= function(item){

  return {
      x: item.cx- item.r,
      y: item.cy-item.r,
      width: item.r*2,
      height: item.r*2
  }
}

const _lineBounds = function(item){
  return {
      x: Math.min(item.x1, item.x2),
      y: Math.min(item.y1, item.y2),
      width: Math.abs(item.x2 - item.x1),
      height: Math.abs(item.y2- item.y1)
  }
}

const _ellipseBounds= function(item){
  return {
      x: item.cx - item.rx,
      y: item.cy - item.ry,
      width: item.rx*2,
      height: item.ry*2
  }
}

const _rectBounds = function(item){
  
  return {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height
  }
}

const _pathBounds = function(item){
  
  return {
      x: 0,
      y: 0,
      width: 10,
      height: 10
  }
}


const _minMax = function(bounds, minmax){
	
	const {minX, maxX, minY, maxY} = minmax;

	return {
    		minX : Math.min(bounds.x, minX),
    		maxX : Math.max(bounds.x+bounds.width,maxX),
   	 		minY : Math.min(bounds.y, minY),
    		maxY : Math.max(bounds.y+bounds.height, maxY)
    }
}

const _calculateBounds = function(nodes, minX, maxX, minY, maxY){
 	
  const _minmax = Object.keys(nodes).reduce((acc, key)=>{
  		const item = nodes[key];
  		const minmax = {
  							minX:acc.minX,
  							maxX:acc.maxX,
  							minY:acc.minY,
  							maxY:acc.maxY
  						};

 		switch(item.type){
        
	        case "group":
	          return _minMax(_calculateBounds(item.children, acc.minX, acc.maxX, acc.minY, acc.maxY), minmax);

	        case "circle":
	          return _minMax(_circleBounds(item), minmax);

	        case "ellipse":
	          return _minMax( _ellipseBounds(item), minmax);

	        case "line":
	          return _minMax(_lineBounds(item), minmax);
	         
	       case "path":
	       	  return _minMax(_pathBounds(item), minmax);     

	        case "rect":
	          return _minMax(_rectBounds(item), minmax);
	          
	    }	

  },{minX:minX, minY:minY, maxX:maxX, maxY:maxY});


  return {
  	x:_minmax.minX,
  	y: _minmax.minY,
  	width: _minmax.maxX - _minmax.minX,
  	height: _minmax.maxY - _minmax.minY
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

	    case "path":
	    	return _path_schema();

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

		case "path":
			return _path(x,y);

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
		case "path":
			return {x:0, y:0}

		case "group":
			return {x:node.width/2, y:node.height/2}

		case "ellipse":
		case "circle":
			return {x:node.cx, y:node.cy}

		default:
			return null;
	}
}

export function scalePreservingOrigin(x,y,sf){
	//return `translate(${node.cx},${node.cy}) scale(${sf}) translate(${-node.cx},${-node.cy})`
	return `scale(${sf}),translate(${-(x - (x/sf))},${-(y - (y/sf))})`
}

export function camelise(style){
	
	style = style || {};

	return Object.keys(style).reduce((acc,key)=>{
		acc[_.camelCase(key)] = style[key];
		return acc;
	},{});

}

export function interpolatedStyles(styles, types, style){

	return styles.filter(key=>types[key]==="number").filter(key=>style[key]).reduce((acc, key)=>{
			const n = Number(style[key]);
			if (!isNaN(n)){
				acc[key] = spring(n); 
			}
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

export function defaultCode(key, property){
   if (["scale", "rotate", "translate"].indexOf(property) !== -1){
      
      switch (property){
          case "scale":
            return `return \`scale(\${${key}%3})\`;`;

          case "rotate":
            return `return \`rotate(\${${key}%360})\``;

         default:
            return `return \`translate(\${${key}},\${${key}})\``;
      }
   }
   return `return ${key}`
}

export function generateId(){
	return (1+Math.random()*4294967295).toString(16);
}

