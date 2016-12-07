import React, { Component } from 'react';

export default class Text extends Component {

	render(){
		const {x,y,text} = this.props;
		return <text x={x} y={y}>{text}</text>
	}

}