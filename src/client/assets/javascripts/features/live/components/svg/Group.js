import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {Circle, Text, Line, Rect, Ellipse,Path} from "./"
import {camelise, camelCase, componentsFromTransform, interpolatedStyles, schemaLookup} from 'utils';
import { selector } from '../..';
import { connect } from 'react-redux';

const styles = Object.keys(schemaLookup("group").style).map((c)=>camelCase(c));

const schema = {...schemaLookup("group").attributes, ...schemaLookup("group").style};

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

@connect(selector)
export default class Group extends Component {

	renderChildren(children, path){

		//const {onSelect} = this.props;
		const {nodesById} = this.props;

		return children.map((key)=>{
			
			const item = nodesById[key];

			switch(item.type){
				
				case "circle":
					return <Circle key={item.id} id={item.id}/>
			 	
			 	case "ellipse":
					return <Ellipse key={item.id} id={item.id}/>

				case "rect":
					return <Rect key={item.id} id={item.id}/>

				case "text":
					return <Text key={item.id} id={item.id}/>

				case "line":
					return <Line key={item.id} id={item.id}/>

			 	case "path":
					return <Path key={item.id} id={item.id}/>

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

		const {scale=1,rotate,translate} = componentsFromTransform(transform);
		//const [tx,ty]= translate || [0,0];
		

		const motionstyle = {
			x: spring(Number(x ? x : 0) || 0),
			y: spring(Number(y ? y : 0) || 0),
			scale: spring(Number(scale ? scale : 0) || 0),
			rotate: spring(Number(rotate ? rotate[0] : 0) || 0),
			interolatedStyles: is,
		}

		return (<Motion style={motionstyle}>
	 				{({x,y,scale,rotate,interpolatedStyles}) => {
	 					const _s = Object.assign({},_style,interpolatedStyles);
	 					const _transform = `translate(${x}, ${y}) scale(${scale}) rotate(${rotate})`;
	 					return <g transform={`${_transform}`} style={_s}>
	 						{this.renderChildren(children)}
	 					</g>								
	 					
				 	}}	 
				</Motion>)

	}
}