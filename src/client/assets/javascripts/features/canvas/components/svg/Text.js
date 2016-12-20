import React, { Component } from 'react';
import {Motion, spring} from 'react-motion';

export default class Text extends Component {

	render(){
		const {x,y,text} = this.props;
		return (<Motion style={{x: spring(x), y: spring(y)}}>
			 		{
			 			(item) => { return <text x={item.x} y={item.y}>{text}</text>}
			 		}
				</Motion>)
	}

}