import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import {schemaLookup} from '../../../../utils';

const schema = {...schemaLookup("text").attributes, ...schemaLookup("text").style};
const styles = Object.keys(schemaLookup("text").style).map((c)=>_.camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});

export default class Text extends Component {

	static defaultProps = {
   		transform: "translate(0,0)"
  	};

	render(){
		const {x,y,text,selected,transform, onSelect} = this.props;
		let {style} = this.props;
		
		
		style = style || {};
		
		style = Object.keys(style).reduce((acc,key)=>{
			acc[_.camelCase(key)] = style[key];
			return acc;
		},{});

		const interpolatedStyles = styles.filter(key=>types[key]==="number").filter(key=>style[key]).reduce((acc, key)=>{
			const n = Number(style[key]);
			if (!isNaN(n)){
				acc[key] = spring(n); 
			}
			return acc;
		},{});


		return (<Motion style={{x: spring(Number(x)), y: spring(Number(y)),...interpolatedStyles}}>
			 		{
			 			(item) => { 
			 				const _style = Object.assign({},style,item,{fontSize:`${item.fontSize}px`});
			 				console.log(_style);

			 				return 	<g transform={transform}>
			 							<text x={item.x} y={item.y} style={_style} onClick={onSelect}>{text}</text>
			 						</g>
			 			}
			 		}
				</Motion>)
	}

}