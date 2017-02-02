import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {Circle, Text, Line, Rect, Ellipse,Path} from "./"
import {camelise, camelCase, componentsFromTransform, interpolatedStyles, schemaLookup} from 'utils';


const styles = Object.keys(schemaLookup("group").style).map((c)=>camelCase(c));

const schema = {...schemaLookup("group").attributes, ...schemaLookup("group").style};

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[camelCase(key)] = schema[key].type;
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

		//const {onSelect} = this.props;
		const {nodesById} = this.props;

		return children.map((key)=>{
			
			const item = nodesById[key];

			switch(item.type){
				
				case "circle":

					return <Circle key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				r: item.r,
			 				style:item.style,
			 		}}/>
			 	
			 	case "ellipse":
					return <Ellipse key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				rx: item.rx,
			 				ry: item.ry,
			 				style:item.style,
					}}/>

				case "rect":
					return <Rect key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				width: item.width,
			 				height: item.height,
			 				style:item.style,
			 		}}/>

				case "text":
					return <Text key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				text: item.text,
			 				style:item.style,
			 		}}/>

				case "line":
					return <Line key={item.id} {...{
			 				id: item.id,
			 				x1: item.x1,
			 				y1: item.y1,
			 				x2: item.x2,
			 				y2: item.y2,
			 				style:item.style,
			 		}}/>

			 	case "path":
					return <Path key={item.id} {...{
			 				id: item.id,
			 				d: item.d,
			 				style:item.style,
			 		}}/>

				case "group":
					return <Group key={item.id} {...{...this.props, ...{id:item.id}}}/>
					
				default:
					return null;
			}
		});
	}

    

	render(){
		
		const {id, nodesById} = this.props;
		
		const node = nodesById[id];

		const {x, y, style, transform="translate(0,0)", children} = node;

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
			 			return <g style={_style} transform={_transform}>
							{this.renderChildren(children)}
			 			</g>
			 		}}
			   </Motion>
	}
}