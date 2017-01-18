import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise, interpolatedStyles,componentsFromTransform } from '../../../../utils';
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
		const {scale=1,rotate,translate} = componentsFromTransform(transform);
		const [x,y]= translate || [0,0];
		
		const motionstyle = {
			cx: spring(Number(cx) || 0),
			cy: spring(Number(cy) || 0),
			r:spring(Number(r) || 0),
			scale: spring(Number(scale)),
			tx: spring(Number(x) || 0),
			ty: spring(Number(y) || 0),
			rotate: spring(Number(rotate) || 0),
			...is,
		}

		return (	
						<Motion style={motionstyle}>
			 				{(item) => {
			 					const _s = Object.assign({},_style,item);
			 					
			 					const _transform = `scale(${item.scale}),translate(${x},${y}),rotate(${item.rotate})`; 
			 					
			 					return 	<g transform={transform}>
			 								<circle cx={cx} cy={cy} r={item.r} style={_s} onClick={onSelect}/>
			 							</g>
						 	}}	 
						</Motion>
					
				)
		
	}
}