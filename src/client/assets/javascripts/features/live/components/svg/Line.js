import React, { Component } from 'react';

export default class Line extends Component {

	render(){
		const {x1,x2,y1,y2} = this.props;
		const style ={
			stroke: "#000",
			strokeWidth: 2
		}
		return <line x1={x1} x2={x2} y1={y1} y2={y2} style={style}/>
	}
}