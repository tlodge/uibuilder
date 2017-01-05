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

const objspring = (obj)=>{
	return {x:10};
}

export default class Circle extends Component {
	render(){
	
		const {id,cx,cy,r,selected, onSelect} = this.props;
		let {style} = this.props;
		style = style || {};

		const interpolatedStyles = styles.filter(key=>types[key]==="number").filter(key=>style[key]).reduce((acc, key)=>{
			acc[key] = spring(style[key]); 
			return acc;
		},{});

		const _style = Object.assign({}, style, {
			fill: selected ? "red" : "black",
			stroke: 'black',
		});

		return (	
						<Motion style={{cx: spring(cx), cy: spring(cy), r:spring(r), ...interpolatedStyles}}>
			 				{(item) => {
			 					const style = Object.assign({},_style,item);

			 					return <circle cx={item.cx} cy={item.cy} r={item.r} style={style} onClick={onSelect}/>
						 	}}	 
						</Motion>
					
				)
		
	}
}