import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';
import _ from 'lodash';
import {Circle, Text, Line, Rect, Ellipse} from "./"
import {camelise} from '../../../../utils';

export default class Group extends Component {
	
	static defaultProps = {
   		onSelect: ()=>{}
  	};

	renderChildren(children, path){

		const {onSelect} = this.props;
		
		return Object.keys(children).map((key, i)=>{
			
			const item = children[key];

			switch(item.type){
				
				case "circle":

					return <Circle key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				r: item.r,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
			 		}}/>
			 	
			 	case "ellipse":
					return <Ellipse key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				rx: item.rx,
			 				ry: item.ry,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
					}}/>

				case "rect":
					return <Rect key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				width: item.width,
			 				height: item.height,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
			 		}}/>

				case "text":
					return <Text key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				text: item.text,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

				case "line":
					return <Line key={item.id} {...{
			 				id: item.id,
			 				x1: item.x1,
			 				y1: item.y1,
			 				x2: item.x2,
			 				y2: item.y2,
			 				style:item.style,
							selected: false,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

				case "group":
					return <g key={i} style={camelise(item.style)}>
								{this.renderChildren(item.children, [...path, item.id])}
							</g>
							
				default:
					return null;
			}
		});
	}

	render(){
		
		const {id, style, children, x, y} = this.props;
	
		return <g style={camelise(style)} transform={`translate(${x}, ${y})`}>
					{this.renderChildren(children, [id])}
			 	</g>
	}
}