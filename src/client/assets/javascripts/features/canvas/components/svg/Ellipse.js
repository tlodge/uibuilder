import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise} from '../../../../utils';
import _ from 'lodash';

const schema = {...schemaLookup("circle").attributes, ...schemaLookup("circle").style};
const styles = Object.keys(schemaLookup("circle").style).map((c)=>_.camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});

const degToRad = (degrees)=>{
	return (Math.PI / 180) + degrees; 
}

export default class Ellipse extends Component {
	
	static defaultProps = {
   		transform: "translate(0,0)"
  	};

	render(){
	
		const {id,cx,cy,rx,ry,selected, transform, onSelect} = this.props;

		let {style} = this.props;

		style = camelise(style);
		

		const interpolatedStyles = styles.filter(key=>types[key]==="number").filter(key=>style[key]).reduce((acc, key)=>{
			const n = Number(style[key]);
			if (!isNaN(n)){
				acc[key] = spring(n); 
			}
			return acc;
		},{});

		return (	
						<Motion style={{cx: spring(Number(cx) || 0), cy: spring(Number(cy) || 0), rx:spring(Number(rx) || 0), ry:spring(Number(ry) || 0), ...interpolatedStyles}}>
			 				{(item) => {
			 					const _style = Object.assign({},style,item);
			 					
			 					return 	<g transform={transform}>
			 								<ellipse cx={item.cx} cy={item.cy} rx={item.rx} ry={item.ry} style={_style} onClick={onSelect}/>
			 							</g>
						 	}}	 
						</Motion>
					
				)
		
	}
}