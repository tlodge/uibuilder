import React, { Component } from 'react';
import '../Canvas.scss';
import {Motion, spring} from 'react-motion';

export default class Circle extends Component {
	render(){
		const {id,cx,cy,r} = this.props;
		return (	
						<Motion style={{cx: spring(cx), cy: spring(cy), r:spring(r)}}>
			 				{(item) => {
			 					return <circle cx={item.cx} cy={item.cy} r={item.r}/>
						 	}}	 
						</Motion>
					
				)
		
	}
}