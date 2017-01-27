import React, { Component } from 'react';
import {schemaLookup, camelise} from 'utils';

export default class Rect extends Component {

	static defaultProps = {
   		transform: "translate(0,0)",
   		onSelect: ()=>{}
  	};

  	renderControls(width, height){
  		
  		const {onExpand, onRotate, r} = this.props;
  		const  x =0, y=0;

  		const style = {
			stroke: "black",
			strokeWidth: 1,
			fill: '#3f51b5',
		}

		const rotatestyle = {
			stroke: "black",
			strokeWidth: 1,
			fill: 'red',
		}

		const linestyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
		}

  		return 	<g>
  					<circle style={rotatestyle}  cx={x+width/2} cy={y-40} r={6} onMouseDown={onRotate}/>
  					<line style={linestyle} x1={x+width/2} x2={x+width/2} y1={y-40+6} y2={y}/>
  					<circle style={style} cx={x} cy={y} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={x} cy={y+height} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={x+width} cy={y} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={x+width} cy={y+height} r={6} onMouseDown={onExpand}/>
  				</g>
  	}

	render(){
		const {id,x,y,rx,ry,width,height,transform,selected,style,onSelect,onMouseDown} = this.props
		const _style = camelise(style);
		const amSelected = selected.indexOf(id) !== -1 && selected.length == 1;




		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const sw = _style.strokeWidth ? Number(sw) ? Number(sw) : 0 : 0;

		const selectedw = (Number(width)+4+sw/2);
		const selectedh = (Number(height)+4+sw/2);

		return 	<g transform={`translate(${x},${y}) ${transform}`}>
			 		<rect rx={rx} ry={ry} x={0} y={0} width={width} height={height} style={_style} onClick={onSelect} onMouseDown={onMouseDown}/>
			 		{amSelected && <rect rx={rx} ry={ry} x={-2} y={-2} width={selectedw} height={selectedh} style={_selectedstyle} />}
			 		{amSelected && this.renderControls(selectedw, selectedh)}
			 	</g>

	}

}