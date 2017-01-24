import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector } from '../../';
import './Canvas.scss';
import {Circle,Ellipse,Text,Rect,Line,Path,Group} from '../svg/';
import { DropTarget } from 'react-dnd';
import {DatasourceManager} from 'datasources';
import {PALETTE_WIDTH} from 'features/palette/constants';


function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const canvasTarget = {
  drop(props,monitor) {
    const {template,children} = monitor.getItem();

    const {x,y}   = monitor.getSourceClientOffset()
    if (template !== "group"){
      props.dispatch(canvasActions.templateDropped(template,(x-100),y))
    }else{
      props.dispatch(canvasActions.groupTemplateDropped(children, (x-100), y))
    }
  }
};

const ItemTypes = {
  TEMPLATE: 'template'
};

class EditorCanvas extends Component {

  constructor(props, context){
  	super(props, context);
  	this._onMouseMove = this._onMouseMove.bind(this);
    this.mouseMove = bindActionCreators(canvasActions.mouseMove, props.dispatch);
    this.onMouseUp = bindActionCreators(canvasActions.onMouseUp, props.dispatch);
    this.onMouseDown = bindActionCreators(canvasActions.onMouseDown, props.dispatch);
    this.templateSelected = bindActionCreators(canvasActions.templateSelected, props.dispatch);
    this.onExpand = bindActionCreators(canvasActions.onExpand, props.dispatch);
    this.deletePressed = bindActionCreators(canvasActions.deletePressed, props.dispatch);
    this._handleKeyDown = this._handleKeyDown.bind(this);

    window.addEventListener('keydown', this._handleKeyDown);
  }	

  _onMouseMove(e){
    const {clientX, clientY} = e;
    this.mouseMove(clientX-PALETTE_WIDTH,clientY);
  }


  renderTemplate(template, path){
      const props = {
                       selected: path,
                       onSelect: this.templateSelected.bind(null,{path:[template.id], type:template.type}),
                       onMouseDown: this.onMouseDown.bind(null, {path:[template.id], type: template.type}),
                       onExpand: this.onExpand.bind(null, template.id),
                       ...template, 
                    };
    
      switch(template.type){
          
          case "circle":
          
            return <Circle key={template.id} {...props}/>
          
          case "ellipse":
            return <Ellipse key={template.id} {...props}/>

          case "rect":
            return <Rect key={template.id} {...props}/>

          case "path":
            return <Path key={template.id} {...props}/>
          
          case "text":
            return <Text key={template.id} {...props}/>
          
          case "line":
            return <Line key={template.id}  {...props}/>

          case "group":
           
            return <Group key={template.id} {
                                              ...{
                                                  selected: path,
                                                  ...template,
                                                  onSelect: this.templateSelected,
                                                  onMouseDown: this.onMouseDown,
                                                  onExpand: this.onExpand.bind(null, template.id),
                                              }
                                            }/>

       }
      
       return null;

  }


  renderTemplates(){
  
    const {canvas:{templates, selected}} = this.props;
    
    console.log("in render templates and selected is");
    console.log(selected);

    return Object.keys(templates).map((key)=>{
       const path = selected ? selected.path : [];
       return this.renderTemplate(templates[key], path);
    });
  }

  render() {

  	const {w,h,ow,oh, view, connectDropTarget} = this.props;

    return connectDropTarget(
      <div onMouseMove={this._onMouseMove} className="canvas">
        <svg id="svgchart" viewBox={`0 0 ${ow} ${oh}`} width={w} height={h} onMouseUp={this.onMouseUp}>
    		  {view==="editor" && this.renderTemplates()}	
          {view==="live" && this.renderNodes()}	
    		</svg>
      </div>
    );
  }

  _handleKeyDown(e) {
      var rx = /INPUT|SELECT|TEXTAREA|DIV/i;
      if( e.which == 8 ){ // 8 == backspace
            if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
                this.deletePressed();
                e.preventDefault();
            }
      }
  }

}

export default connect(selector)(DropTarget(ItemTypes.TEMPLATE, canvasTarget, collect)(EditorCanvas));
