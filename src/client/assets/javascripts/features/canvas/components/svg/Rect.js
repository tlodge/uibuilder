import React, { Component } from 'react';

export default class Rectangle extends Component {

	render(){
		const {x,y,width,height} = this.props
		const style ={
			stroke: "#000",
			strokeWidth: 2
		}
		return <rect x={x} y={y} width={width} height={height} style={style}/>
	}

}