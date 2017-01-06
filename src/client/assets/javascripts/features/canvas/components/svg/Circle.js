import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';
import {schemaLookup} from '../../../../utils';
import _ from 'lodash';

const schema = {...schemaLookup("circle").attributes, ...schemaLookup("circle").style};
const styles = Object.keys(schemaLookup("circle").style).map((c)=>_.camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});


export default class Circle extends Component {
	render(){
	
		const {id,cx,cy,r,selected, onSelect} = this.props;
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


		return (	
						<Motion style={{cx: spring(Number(cx) || 0), cy: spring(Number(cy) || 0), r:spring(Number(r) || 0), ...interpolatedStyles}}>
			 				{(item) => {
			 					const _style = Object.assign({},style,item);

			 					return <circle cx={item.cx} cy={item.cy} r={item.r} style={_style} onClick={onSelect}/>
						 	}}	 
						</Motion>
					
				)
		
	}
}