import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as liveActions, selector } from '../../';
import './Canvas.scss';
import {Circle,Ellipse,Text,Rect,Line,Path,Group} from '../svg/';
import {PALETTE_WIDTH} from 'features/palette/constants';


@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(liveActions, dispatch)
  }
})

export default class LiveCanvas extends Component {

  constructor(props, context){
  	super(props, context);
  }	

  componentDidMount(){
    this.props.actions.initNodes();
  }

  renderNode(node){
     
      const {live:{nodesById}} = this.props;

      switch(node.type){
          
          case "circle":
            return <Circle key={node.id} id={node.id}/>

          case "ellipse":
            return <Ellipse key={node.id} id={node.id}/>

          case "rect":
            return <Rect key={node.id} id={node.id}/>
          
          case "text":
            return <Text key={node.id} id={node.id}/>

          case "path":
            return <Path key={node.id} id={node.id}/>
          
          case "line":
            return <Line key={node.id} id={node.id}/>

          case "group":
            return <Group key={node.id} {...{
                id: node.id,
                nodesById,
            }}/>

       }
      
       return null;

  }

  renderNodes(){
      
      //eventually can just pass in the id, and nodes will do the rest themselves.

      const {live:{nodes, nodesById}} = this.props;
     
      return nodes.map((id)=>{
        return this.renderNode(nodesById[id]);
      });
  }

  render() {

  	const {w,h,ow,oh} = this.props;

    
    return <div className="canvas">
      <svg id="svgchart" viewBox={`0 0 ${ow} ${oh}`} width={w} height={h}>
    		{this.renderNodes()}	
    	</svg>
    </div>
  
  }
}
