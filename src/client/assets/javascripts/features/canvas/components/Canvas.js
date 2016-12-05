import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as canvasActions, selector } from '../';
import './Canvas.scss';
import {DragLayer} from 'react-dnd';

function collect(monitor) { 
  
  return { 
  		item: monitor.getItem(),
    	itemType: monitor.getItemType(),
    	currentOffset: monitor.getSourceClientOffset(),
    	isDragging: monitor.isDragging()
   };
}

class Canvas extends Component {

  constructor(props, context){
  	super(props, context);
  	this._onMouseMove = this._onMouseMove.bind(this);
  	this.mouseMove = bindActionCreators(canvasActions.mouseMove, props.dispatch);
  }	

  _onMouseMove(e){
    const {clientX, clientY} = e;
    this.mouseMove(clientX,clientY);
  }

  render() {
    return (
      <div onMouseMove={this._onMouseMove} className="canvas">
        	I am the canvas!
      </div>
    );
  }
}

export default connect(selector)(DragLayer(collect)(Canvas))