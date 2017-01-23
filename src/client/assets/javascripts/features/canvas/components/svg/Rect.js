import React, { Component } from 'react';
import {schemaLookup, camelise} from 'utils';

export default class Rect extends Component {

	static defaultProps = {
   		transform: "translate(0,0)",
   		onSelect: ()=>{}
  	};

  	renderControls(x,y, width, height){
  		
  		const {onExpand} = this.props;
  		
  		const style = {
			stroke: "black",
			strokeWidth: 1,
			fill: '#3f51b5',
		}

  		return 	<g>
  					<circle style={style} cx={x} cy={y} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={x} cy={y+height} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={x+width} cy={y} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={x+width} cy={y+height} r={6} onMouseDown={onExpand}/>
  				</g>
  	}

	render(){
		const {x,y,rx,ry,width,height,transform,selected,style,onSelect,onMouseDown} = this.props
		const _style = camelise(style);

		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const selectedx = (Number(x)-2-Number(_style.strokeWidth ? _style.strokeWidth/2:0));
		const selectedy = (Number(y)-2-Number(_style.strokeWidth ? _style.strokeWidth/2:0));
		const selectedw = (Number(width)+4+Number(_style.strokeWidth ? _style.strokeWidth/2:0));
		const selectedh = (Number(height)+4+Number(_style.strokeWidth ? _style.strokeWidth/2:0));

		return 	<g transform={transform}>
			 		<rect rx={rx} ry={ry} x={x} y={y} width={width} height={height} style={_style} onClick={onSelect} onMouseDown={onMouseDown}/>
			 		{selected && <rect rx={rx} ry={ry} x={selectedx} y={selectedy} width={selectedw} height={selectedh} style={_selectedstyle} />}
			 		{selected && this.renderControls(selectedx, selectedy, selectedw, selectedh)}
			 	</g>

	}

}