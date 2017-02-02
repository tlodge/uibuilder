import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise, camelCase, interpolatedStyles} from 'utils';

const schema = {...schemaLookup("circle").attributes, ...schemaLookup("circle").style};
const styles = Object.keys(schemaLookup("circle").style).map((c)=>camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);


export default class Ellipse extends Component {
	
	static defaultProps = {
   		transform: "translate(0,0)"
  	};

	render(){
	
		const {id,cx,cy,rx,ry,style,transform} = this.props;

		const _style = camelise(style);
		const is = _interpolatedStyles(_style);

		return (	
						<Motion style={{cx: spring(Number(cx) || 0), cy: spring(Number(cy) || 0), rx:spring(Number(rx) || 0), ry:spring(Number(ry) || 0), ...is}}>
			 				{(item) => {
			 					const _s = Object.assign({},_style,item);
			 					
			 					return 	<g transform={transform}>
			 								<ellipse cx={item.cx} cy={item.cy} rx={item.rx} ry={item.ry} style={_s}/>
			 							</g>
						 	}}	 
						</Motion>
					
				)
		
	}
}