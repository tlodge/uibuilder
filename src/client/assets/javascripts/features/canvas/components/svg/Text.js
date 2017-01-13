import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import {schemaLookup, camelise, interpolatedStyles} from '../../../../utils';

const schema = {...schemaLookup("text").attributes, ...schemaLookup("text").style};
const styles = Object.keys(schemaLookup("text").style).map((c)=>_.camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[_.camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

export default class Text extends Component {

	static defaultProps = {
   		transform: "translate(0,0)"
  	};

	render(){
		const {x,y,text,selected,transform, style, onSelect} = this.props;

		
		const _style = camelise(style);
		const is = _interpolatedStyles(_style);
		
		return (<Motion style={{x: spring(Number(x)), y: spring(Number(y)),...is}}>
			 		{
			 			(item) => { 
			 				const _s = Object.assign({},_style,item,{fontSize:`${item.fontSize}px`});
			 			

			 				return 	<g transform={transform}>
			 							<text x={item.x} y={item.y} style={_s} onClick={onSelect}>{text}</text>
			 						</g>
			 			}
			 		}
				</Motion>)
	}

}