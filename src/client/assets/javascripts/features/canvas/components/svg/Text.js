import React, { Component } from 'react';
import {camelise} from 'utils';


export default class Text extends Component {

	static defaultProps = {
   		transform: "translate(0,0)"
  	};

	render(){
		const {x,y,text,selected,transform, style, onSelect,onMouseDown} = this.props;

		const _style = camelise(style);

		return 	<g transform={transform}>
			 		<text x={x} y={y} style={_style} onClick={onSelect} onMouseDown={onMouseDown}>{text}</text>
			 	</g>

	}

}