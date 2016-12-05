import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as editorActions, selector } from '../';
import Canvas from '../../canvas/components';
import Palette from '../../palette/components'
import DragDropContainer from '../../../components/DragDrop';
import { Flex, Box } from 'reflexbox'
import './Editor.scss';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(editorActions, dispatch)
}))

export default class Editor extends Component {

	constructor(props,context){
		super(props,context);
		this._handleResize = this._handleResize.bind(this);
	}		
  	
  	componentDidMount(){
		window.addEventListener('resize', this._handleResize);
  	}

  	render() {
  		console.log("props isn ediroe are");
  		console.log(this.props);

  		const {w,h} = this.props.editor;

    	return (
      	 	<div className="editor">
      	 		<DragDropContainer w={w} h={h}>
      	 			<div className="palettecontainer"><Palette/></div>
   					<div className="canvascontainer"><Canvas/></div>
   				</DragDropContainer>
      		</div>
    	);
  	}

  	_handleResize(e){
  		console.log(this.props)
     	const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      	const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      	this.props.actions.screenResize(w,h);
  	}
}