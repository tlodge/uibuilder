import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as editorActions, selector } from '../';
import { actionCreators as sourceActions} from '../../sources';

import Canvas from '../../canvas/components';
import Palette from '../../palette/components';
import Mapper from '../../mapper/components/Mapper';
import DragDropContainer from '../../../components/DragDrop';
import './Editor.scss';
import {DatasourceManager} from '../../../datasources';
import {viewConstants} from '../../palette';



@connect(selector, (dispatch) => {
  DatasourceManager.init(bindActionCreators(sourceActions.registerSource, dispatch));
  return{
     actions: bindActionCreators(editorActions, dispatch)
  }
})

export default class Editor extends Component {

	 constructor(props,context){
		  super(props,context);
		  this._handleResize = this._handleResize.bind(this);
   }		
  	
    componentDidMount(){
		  window.addEventListener('resize', this._handleResize);
  	}


  	render() {
  		
  		const {w,h,ow,oh} = this.props.editor;
      
      const canvasstyle ={
        left: viewConstants.PALETTE_WIDTH,
        width: w-viewConstants.PALETTE_WIDTH,
      }

    	return (
      	<div className="editor">
            <DragDropContainer w={w} h={h}>
              <Palette/>
              <div className="canvascontainer" style={canvasstyle}>
                  <Canvas w={w} h={h} ow={ow} oh={oh}/>
              </div> 
              <Mapper height={h}/>
            </DragDropContainer>
          </div>
    	);
  	}

  	_handleResize(e){
     	  const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      	const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      	this.props.actions.screenResize(w,h);
  	}
}