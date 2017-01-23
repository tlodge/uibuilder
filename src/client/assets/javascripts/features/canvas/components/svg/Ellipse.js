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

		const _style = camelise(style);
		
		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const selectedrx = (Number(rx)+2+Number(_style.strokeWidth ? _style.strokeWidth/2:0));
		const selectedry = (Number(ry)+2+Number(_style.strokeWidth ? _style.strokeWidth/2:0));
		
		return 	<g transform={transform}>
			 		<ellipse cx={cx} cy={cy} rx={rx} ry={ry} style={_style} onClick={onSelect} onMouseDown={onMouseDown}/>
			 		{selected && this.renderControls(selectedrx, selectedry)}
			 	</g>

	}
}