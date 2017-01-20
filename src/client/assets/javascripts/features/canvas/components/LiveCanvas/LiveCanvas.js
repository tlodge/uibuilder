import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as liveActions, selector } from '../../reducers/live';
import '../Canvas.scss';
import {Circle,Ellipse,Text,Rect,Line,Path,Group} from '../svg/';
import {PALETTE_WIDTH} from '../../../palette/constants';


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
     
      
      switch(node.type){
          
          case "circle":
            return <Circle key={node.nodeId} {...node}/>

          case "ellipse":
            return <Ellipse key={node.nodeId} {...node}/>

          case "rect":
            return <Rect key={node.nodeId} {...node}/>
          
          case "text":
            return <Text key={node.nodeId} {...node}/>

          case "path":
            return <Path key={node.nodeId} {...node}/>
          
          case "line":
            return <Line key={node.nodeId} {...node}/>

          case "group":
            return <Group key={node.nodeId} {...node}/>

       }
      
       return null;

  }

  renderNodes(){
      console.log("props are.....");
      console.log(this.props);

      const {live:{nodes}} = this.props;
     
      const n = [];
      Object.keys(nodes).map((templatekey)=>{
          Object.keys(nodes[templatekey]).map((nodekey)=>{
              
              n.push(this.renderNode(nodes[templatekey][nodekey]));
          })
      });
      return n;
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
