import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise,interpolatedStyles} from '../../../../utils';
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
		const {x,y,width,height,transform,onSelect,style} = this.props
		
		const is = _interpolatedStyles(style)

		return <Motion style={{x: spring(Number(x) || 0), y: spring(Number(y) || 0), width:spring(Number(width) || 0), height:spring(Number(height) || 0), ...is}}>
			 		{(item) => {
			 			const _style = Object.assign({},style,item);
			 					
			 			return 	<g transform={transform}>
			 					<rect x={item.x} y={item.y} width={item.width} height={item.height} style={_style} onClick={onSelect}/>
			 				</g>
					}}	 
				</Motion>
	}

}