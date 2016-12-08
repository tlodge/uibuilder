import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector } from '../';
import './Canvas.scss';
import {Circle,Text,Rect,Line} from './svg/';
import { DropTarget } from 'react-dnd';
import {DatasourceManager} from '../../../datasources';


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const canvasTarget = {
  drop(props,monitor) {
   
    const {shape} = monitor.getItem();
    const {x,y}   = monitor.getSourceClientOffset()
    props.dispatch(canvasActions.shapeDropped(shape,(x-100),y))
     //this.shapeDropped(props.type,x,y);
  }
};

const ItemTypes = {
  TEMPLATE: 'template'
};

class Canvas extends Component {

  constructor(props, context){
  	super(props, context);
  	this._onMouseMove = this._onMouseMove.bind(this);
    this.mouseMove = bindActionCreators(canvasActions.mouseMove, props.dispatch);
    this.shapeDropped = bindActionCreators(canvasActions.shapeDropped, props.dispatch);
    this.updateAttribute = bindActionCreators(canvasActions.updateAttribute, props.dispatch);
    this._subscribe = this._subscribe.bind(this);
  }	

  _onMouseMove(e){
    const {clientX, clientY} = e;
    this.mouseMove(clientX,clientY);
  }

  _subscribe(id){
      console.log("--------->subscribing!!");
      console.log(id);
      var ds = DatasourceManager.get(0);
      ds.emitter.addListener('data', (data)=>{
          this.updateAttribute(id, "cx", data.value);
      });
  }

  renderShapes(){
    
    const {canvas:{shapes}} = this.props;
    
    return shapes.map((shape)=>{
       switch(shape.type){
          
          case "circle":
            return <Circle key={shape.id} {
                                              ...{
                                                  ...shape, 
                                                  ...{subscribe:this._subscribe}
                                              }
                                          }/>
          
          case "rect":
            return <Rect key={shape.id} {...shape}/>
          
          case "text":
            return <Text key={shape.id}  {...shape}/>
          
          case "line":
            return <Line key={shape.id}  {...shape}/>
       }
      
       return null;
    });
  }

  render() {
  	const {w,h, connectDropTarget} = this.props;
  	
    return connectDropTarget(
      <div onMouseMove={this._onMouseMove} className="canvas">
        <svg id="svgchart" width={w} height={h}>
    		  {this.renderShapes()}		
    		</svg>
      </div>
    );
  }
}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(Canvas));
