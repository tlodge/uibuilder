import React, { Component } from 'react';
import { camelise } from 'utils';

export default class Path extends Component {

	render(){
		const {id,d, style, transform} = this.props;
		const _style = camelise(style);
		return <path d={d} style={_style} />
	}

}