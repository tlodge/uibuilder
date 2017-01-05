import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector } from '../';
import './Canvas.scss';
import {Circle,Text,Rect,Line} from './svg/';
import { DropTarget } from 'react-dnd';
import {DatasourceManager} from '../../../datasources';
import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const canvasTarget = {
  drop(props,monitor) {
   
    const {template} = monitor.getItem();
    const {x,y}   = monitor.getSourceClientOffset()
    props.dispatch(canvasActions.templateDropped(template,(x-100),y))
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
    //this.templateDropped = bindActionCreators(canvasActions.templateDropped, props.dispatch);
    this.templateSelected = bindActionCreators(canvasActions.templateSelected, props.dispatch);
    this.setView = bindActionCreators(canvasActions.setView, props.dispatch);
    //this._subscribe = this._subscribe.bind(this);
  }	

  _onMouseMove(e){
    const {clientX, clientY} = e;
    this.mouseMove(clientX,clientY);
  }


  renderTemplate(template, selected){
      switch(template.type){
          
          case "circle":
            return <Circle key={template.id} {
                                              ...{
                                                  ...{selected: selected},
                                                  ...{onSelect: this.templateSelected.bind(null,{templateId:template.id, type:template.type})},
                                                  ...template, 
                                              }
                                          }/>
          
          case "rect":
            return <Rect key={template.id} {...template}/>
          
          case "text":
            return <Text key={template.id}  {...template}/>
          
          case "line":
            return <Line key={template.id}  {...template}/>
       }
      
       return null;

  }

  renderNode(node){
      switch(node.type){
          
          case "circle":
            return <Circle key={node.id} {...{...node}}/>

          case "rect":
            return <Rect key={node.id} {...node}/>
          
          case "text":
            return <Text key={node.id} {...node}/>
          
          case "line":
            return <Line key={node.id} {...node}/>
       }
      
       return null;

  }

  renderNodes(){
      const {canvas:{nodes}} = this.props;
     
      const n = [];
      Object.keys(nodes).map((templatekey)=>{
          Object.keys(nodes[templatekey]).map((nodekey)=>{
              
              n.push(this.renderNode(nodes[templatekey][nodekey]));
          })
      });
      return n;
  }

  renderTemplates(){
    
    const {canvas:{templates, selected}} = this.props;
    
    return templates.map((template)=>{
       return this.renderTemplate(template, selected && selected.templateId === template.id);
    });
  }

  render() {

   

  	const {w,h, canvas:{view}, connectDropTarget} = this.props;
  	const actions = [];
    

    if (view === "editor"){
      actions.push(<Button flat key="toggle" label="live" onClick={this.setView.bind(null,"live")}>tap_and_play</Button>);
    }else{
      actions.push(<Button flat key="toggle" label="editor" onClick={this.setView.bind(null,"editor")}>mode_edit</Button>);
    }
    

    return connectDropTarget(
      <div onMouseMove={this._onMouseMove} className="canvas">
        <svg id="svgchart" width={w} height={h}>
    		  {view==="editor" && this.renderTemplates()}	
          {view==="live" && this.renderNodes()}	
    		</svg>
        <Toolbar colored title={view} actions={actions} style={{position:'fixed', width:`calc(100vw - 350px)`, background:"#3f51b5", bottom:0}}/>
      </div>
    );
  }
}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(Canvas));
