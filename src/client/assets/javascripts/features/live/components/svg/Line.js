import React, { PureComponent } from 'react';
import { selector } from '../..';
import { connect } from 'react-redux';

@connect(selector)
export default class Line extends PureComponent {

	shouldComponentUpdate(nextProps, nextState){
		return this.props.node != nextProps.node;
	}

	render(){
		const {node} = this.props;
		const {x1,x2,y1,y2,transform="translate(0,0)"} = node;

		const style ={
			stroke: "#000",
			strokeWidth: 2
		}
		return <line x1={x1} x2={x2} y1={y1} y2={y2} style={style}/>
	}
}