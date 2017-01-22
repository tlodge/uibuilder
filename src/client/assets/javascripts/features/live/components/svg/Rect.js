import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise,interpolatedStyles} from 'utils';
import _ from 'lodash';

const schema = {...schemaLookup("rect").attributes, ...schemaLookup("rect").style};

const styles = Object.keys(schemaLookup("rect").style).map((c)=>_.camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

export default class Rect extends Component {

	static defaultProps = {
   		transform: "translate(0,0)",
   		onSelect: ()=>{}
  	};

	render(){
		const {x,y,rx,ry,width,height,transform,style,onSelect,onMouseDown} = this.props
		const _style = camelise(style);
		const is = _interpolatedStyles(_style)

		return <Motion style={{x: spring(Number(x) || 0), y: spring(Number(y) || 0), width:spring(Number(width) || 0), height:spring(Number(height) || 0), ...is}}>
			 		{(item) => {
			 			const _s = Object.assign({},_style,item);
			 				
			 			return 	<g transform={transform}>
			 					<rect rx={rx} ry={ry} x={item.x} y={item.y} width={item.width} height={item.height} style={_s} onClick={onSelect} onMouseDown={onMouseDown}/>
			 				</g>
					}}	 
				</Motion>
	}

}