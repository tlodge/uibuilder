import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise, interpolatedStyles} from '../../../../utils';
import _ from 'lodash';


const styles = Object.keys(schemaLookup("circle").style).map((c)=>_.camelCase(c));

const schema = {...schemaLookup("circle").attributes, ...schemaLookup("circle").style};

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

export default class Circle extends Component {
	
	static defaultProps = {
   		transform: "translate(0,0)",
   		onSelect: ()=>{}
  	};

	render(){
	
		const {id,cx,cy,r,selected, style, transform, onSelect} = this.props;
		const _style = camelise(style);
		const is = _interpolatedStyles(_style);

		return (	
						<Motion style={{cx: spring(Number(cx) || 0), cy: spring(Number(cy) || 0), r:spring(Number(r) || 0), ...is}}>
			 				{(item) => {
			 					const _s = Object.assign({},_style,item);
			 					
			 					return 	<g transform={transform}>
			 								<circle cx={item.cx} cy={item.cy} r={item.r} style={_s} onClick={onSelect}/>
			 							</g>
						 	}}	 
						</Motion>
					
				)
		
	}
}