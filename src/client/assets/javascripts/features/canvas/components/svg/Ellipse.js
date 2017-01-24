import React, { Component } from 'react';
import {camelise} from 'utils';

export default class Ellipse extends Component {
	
	static defaultProps = {
   		transform: "translate(0,0)"
  	};

  	renderControls(rx, ry){
  		
  		const {cx,cy,onExpand} = this.props;
  		
  		const style = {
			stroke: "black",
			strokeWidth: 1,
			fill: '#3f51b5',
		}

  		return 	<g>
  					<circle style={style} cx={cx-rx} cy={cy-ry} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={cx+rx} cy={cy+ry} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={cx+rx} cy={cy-ry} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={cx-rx} cy={cy+ry} r={6} onMouseDown={onExpand}/>
  				</g>
  	}

	render(){
	
		const {id,cx,cy,rx,ry,selected, style,transform, onSelect, onMouseDown} = this.props;
		const amSelected = selected.indexOf(id) !== -1 && selected.length == 1;

		const _style = camelise(style);
		
		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const sw = _style.strokeWidth ? Number(sw) ? Number(sw) : 0 : 0;

		const selectedrx = Number(rx)+2+sw/2;
		const selectedry = Number(ry)+2+sw/2;
		
		return 	<g transform={transform}>
			 		<ellipse cx={cx} cy={cy} rx={rx} ry={ry} style={_style} onClick={onSelect} onMouseDown={onMouseDown}/>
			 		{amSelected && this.renderControls(selectedrx, selectedry)}
			 	</g>

	}
}