import React, { Component } from 'react';
import '../EditorCanvas/Canvas.scss';
import {camelise} from 'utils';


export default class Circle extends Component {
	
	static defaultProps = {
   		transform: "translate(0,0)",
   		onSelect: ()=>{}
  	};

  	constructor(props){
  		super(props);
  		
  	}

  	renderControls(r){
  		
  		const {cx,cy,onExpand} = this.props;
  		
  		const style = {
			stroke: "black",
			strokeWidth: 1,
			fill: '#3f51b5',
		}

  		return 	<g>
  					<circle style={style} cx={cx-r} cy={cy-r} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={cx+r} cy={cy+r} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={cx+r} cy={cy-r} r={6} onMouseDown={onExpand}/> 
  					<circle style={style} cx={cx-r} cy={cy+r} r={6} onMouseDown={onExpand}/>
  				</g>
  	}

	render(){

		const {id,cx,cy,r,selected, style, transform, onSelect, onMouseDown} = this.props;
		const _style = camelise(style);


		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}
	
		const selectedr = (Number(r)+2+Number(_style.strokeWidth ? _style.strokeWidth/2:0));

		return 	<g transform={transform}>
			 		<circle cx={cx} cy={cy} r={r} style={_style} onClick={onSelect} onMouseDown={onMouseDown}></circle>
			 		{selected && <circle cx={cx} cy={cy} r={selectedr} style={_selectedstyle}></circle>}
			 		{selected && this.renderControls(selectedr)}
			 	</g>
		
		
	}
}