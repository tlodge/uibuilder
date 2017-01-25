import React, { Component } from 'react';
import {Circle, Text, Line, Rect, Ellipse,Path} from "./"
import {camelise, componentsFromTransform} from 'utils';

export default class Group extends Component {
	
	static defaultProps = {
   		onSelect: ()=>{},
   		transform: "translate(0,0)",
   		onMouseUp: ()=>{},
   		onMouseDown: ()=>{},
  	};

  	constructor(props){
  		super(props);
  	}

	renderChildren(children, path, selected){

		const {onSelect} = this.props;
		
		return Object.keys(children).map((key, i)=>{
			
			const item = children[key];

			switch(item.type){
				
				case "circle":

					return <Circle key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				r: item.r,
			 				style:item.style,
							selected,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
			 		}}/>
			 	
			 	case "ellipse":
					return <Ellipse key={item.id} {...{
			 				id: item.id,
			 				cx: item.cx,
			 				cy: item.cy,
			 				rx: item.rx,
			 				ry: item.ry,
			 				style:item.style,
							selected,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
					}}/>

				case "rect":
					return <Rect key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				width: item.width,
			 				height: item.height,
			 				style:item.style,
							selected,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),
			 		}}/>

				case "text":
					return <Text key={item.id} {...{
			 				id: item.id,
			 				x: item.x,
			 				y: item.y,
			 				text: item.text,
			 				style:item.style,
							selected,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

				case "line":
					return <Line key={item.id} {...{
			 				id: item.id,
			 				x1: item.x1,
			 				y1: item.y1,
			 				x2: item.x2,
			 				y2: item.y2,
			 				style:item.style,
							selected,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

			 	case "path":
					return <Path key={item.id} {...{
			 				id: item.id,
			 				d: item.d,
			 				style:item.style,
							selected,
							onSelect: onSelect.bind(null,{path:[...path,item.id], type:item.type}),

			 		}}/>

				case "group":
					return <Group key={i} {...{
							...item,
							selected,
						}}/>
							
				default:
					return null;
			}
		});
	}

	renderControls(x,y, width, height){
  		
  		const {onExpand, onRotate} = this.props;
  		
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
  					<circle style={style} cx={x+width+10} cy={y+height+10} r={10} onMouseDown={onExpand}/>
  				</g>
  	}

	render(){

		const {id,x, y, width, height,  style, transform, children, nodeId, selected=[], onSelect, onMouseDown, onMouseUp} = this.props;
		
		const amSelected = selected.indexOf(id) !== -1 && selected.length == 1;
		const [tid, ...rest] = selected;

		const _style = camelise(style);
		
		const {scale=1,rotate,translate} = componentsFromTransform(transform.replace(/\s+/g,""));
		const [degrees,rx,ry] = rotate || [0,0,0];
		const [tx=0,ty=0] = translate || [0,0];

		const dtx = (Number(x)/Number(scale))+Number(tx);
		const dty = (Number(y)/Number(scale))+Number(ty);

		const _selectedstyle = {
			stroke: "#3f51b5",
			strokeWidth: 2,
			fill: 'none',
		}

		const _transform = `scale(${scale}),translate(${dtx},${dty}),rotate(${degrees},${Number(rx)},${Number(ry)})`; 
		
		return <g style={_style} transform={_transform} onMouseDown={onMouseDown.bind(null,{path:[id]})} onClick={onSelect.bind(null,{path:[id],type:"group"})}>
				    {amSelected && this.renderControls(0, 0, width, height)}
					{this.renderChildren(children, [id], rest)}
				    {amSelected && <rect x={0} y={0} width={width} height={height} style={_selectedstyle} />}
			 	</g>


	}


}