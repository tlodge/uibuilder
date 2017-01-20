import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import {Circle, Text, Line, Rect, Ellipse,Path} from "./"
import {camelise, componentsFromTransform, interpolatedStyles, schemaLookup} from '../../../../utils';


const styles = Object.keys(schemaLookup("group").style).map((c)=>_.camelCase(c));

const schema = {...schemaLookup("group").attributes, ...schemaLookup("group").style};

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

export default class Group extends Component {
	
	static defaultProps = {
   		onSelect: ()=>{},
   		transform: "translate(0,0)",
   		onMouseUp: ()=>{},
   		onMouseDown: ()=>{},
  	};

	renderChildren(children, path){

		const {onSelect} = this.props;
		
		return Object.keys(children).map((key, i)=>{
			
			const item = children[key];

			switch(item.type){
				
				case "circle":

					return <Circle key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				r: item.r,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
			 		}}/>
			 	
			 	case "ellipse":
					return <Ellipse key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				rx: item.rx,
			 				ry: item.ry,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
					}}/>

				case "rect":
					return <Rect key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				width: item.width,
			 				height: item.height,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
			 		}}/>

				case "text":
					return <Text key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				text: item.text,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

				case "line":
					return <Line key={item.id} {...{
			 				id: item.id,
			 				x1: item.x1,
			 				y1: item.y1,
			 				x2: item.x2,
			 				y2: item.y2,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

			 	case "path":
					return <Path key={item.id} {...{
			 				id: item.id,
			 				d: item.d,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

				case "group":
					return <Group key={i} {...{
							id: item.id, 
							x:  item.x,
							y:  item.y,
							style: item.style,
							children: item.children
						}}/>

					/*<g key={i} x={item.x} y={item.y} style={camelise(item.style)}>
								{this.renderChildren(item.children, [...path, item.id])}
							</g>*/
							
				default:
					return null;
			}
		});
	}

    //TODO: check why this continuously called by editor when viewing nodes.

	render(){
		

		const {id, style, transform, children, x, y, nodeId, onSelect, onMouseDown, onMouseUp} = this.props;

		const _style = camelise(style);
		const is = _interpolatedStyles(_style);
		
		const {scale=1,rotate,translate} = componentsFromTransform(transform.replace(/\s+/g,""));
		const [degrees,rx,ry] = rotate || [0,0,0];
	

		const [tx=0,ty=0] = translate || [0,0];



		const motionstyle = {
			scale: spring(Number(scale)),
			degrees: spring(Number(degrees) || 0),
			x: spring((Number(x)/Number(scale))+Number(tx)),
			y: spring((Number(y)/Number(scale))+Number(ty)),

			...is,
		}

		const dtx = (Number(x)/Number(scale))+Number(tx);
		const dty = (Number(y)/Number(scale))+Number(ty);

		return <Motion style={motionstyle}>
			 		{(item) => {

			 			let _transform;
			 			
			 			if (scale == 1){
			 			  _transform = `scale(${scale}),translate(${item.x},${item.y}),rotate(${item.degrees},${Number(rx)},${Number(ry)})`; 
						}else{
						  _transform = `scale(${scale}),translate(${dtx},${dty}),rotate(${item.degrees},${Number(rx)},${Number(ry)})`; 
						}
			 			return <g style={_style} transform={_transform} onMouseDown={onMouseDown.bind(null,{path:[id]})}
			 															onClick={onSelect.bind(null,{path:[id],type:"group"})}>
							{this.renderChildren(children, [id])}
			 			</g>
			 		}}
			   </Motion>
	}
}