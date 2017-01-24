import React, { Component } from 'react';
import { camelise } from 'utils';

export default class Path extends Component {

	render(){
		const {id,d,selected, style, transform, onSelect} = this.props;
		const _style = camelise(style);

		const amSelected = selected.indexOf(id) !== -1 && selected.length == 1;


		if (amSelected){
			_style.stroke = "#3f51b5";
			_style.strokeWidth = 2;
		}


		return <path d={d} style={_style} />
	}

}