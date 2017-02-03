import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';
import {schemaLookup, camelise, camelCase, interpolatedStyles} from 'utils';
import { selector } from '../..';
import { connect } from 'react-redux';
const schema = {...schemaLookup("text").attributes, ...schemaLookup("text").style};
const styles = Object.keys(schemaLookup("text").style).map((c)=>camelCase(c));

const types = Object.keys(schema).reduce((acc,key)=>{
	acc[camelCase(key)] = schema[key].type;
	return acc;
},{});

const _interpolatedStyles = interpolatedStyles.bind(null,styles,types);

@connect(selector)
export default class Text extends Component {

	static defaultProps = {
   		transform: "translate(0,0)"
  	};

	render(){
		const node = this.props;
		const {x,y,text,transform="translate(0,0)", style} = node;

		
		const _style = camelise(style);
		const is = _interpolatedStyles(_style);
		
		return (<Motion style={{x: spring(Number(x)), y: spring(Number(y)),...is}}>
			 		{
			 			(item) => { 
			 				const _s = Object.assign({},_style,item,{fontSize:`${item.fontSize}px`});

			 				return 	<g transform={transform}>
			 							<text x={item.x} y={item.y} style={_s}>{text}</text>
			 						</g>
			 			}
			 		}
				</Motion>)
	}

}