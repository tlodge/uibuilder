import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise, camelCase, interpolatedStyles} from 'utils';
import { selector } from '../..';
import { connect } from 'react-redux';
const schema = {...schemaLookup("rect").attributes, ...schemaLookup("rect").style};

const styles = Object.keys(schemaLookup("rect").style).map((c)=>camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

@connect(selector)
export default class Rect extends Component {


	render(){
		
		const {node} = this.props;
		const {x,y,rx,ry,width,height,transform="translate(0,0)",style} = node;
		const _style = camelise(style);
		const is = _interpolatedStyles(_style)
					
		return <Motion style={{x: spring(Number(x) || 0), y: spring(Number(y) || 0), width:spring(Number(width) || 0), height:spring(Number(height) || 0), ...is}}>
			 		{(item) => {
			 			return 	<g transform={`translate(${x},${y})`}>
			 						<g transform={`${transform}`}>
			 							<rect rx={rx} ry={ry} x={0} y={0} width={width} height={height} style={_style}/>
			 						</g>
			 					</g>
					}}	 
				</Motion>
	}

}