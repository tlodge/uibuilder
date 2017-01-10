import React, { Component } from 'react';

export default class Rect extends Component {

	render(){
		const {x,y,width,height,style} = this.props
		
		return <rect x={x} y={y} width={width} height={height} style={style}/>
	}

}