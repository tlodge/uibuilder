import React, { Component } from 'react';
import { camelise } from 'utils';
import { selector } from '../..';
import { connect } from 'react-redux';

@connect(selector)
export default class Path extends Component {

	render(){

		const {node} = this.props;
		const {d, style, transform="translate(0,0)"} = node;
		const _style = camelise(style);

		return <path d={d} style={_style} />
	}

}