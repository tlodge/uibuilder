import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as editorActions, selector } from '../';
import { actionCreators as sourceActions} from '../../sources';

import EditorCanvas from '../../canvas/components/EditorCanvas';
import LiveCanvas from '../../live/components/LiveCanvas';

import Palette from '../../palette/components';
import Mapper from '../../mapper/components/Mapper';
import DragDropContainer from '../../../components/DragDrop';
import './Editor.scss';
import {DatasourceManager} from '../../../datasources';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import {MAPPER_WIDTH} from '../../mapper/constants';
import {PALETTE_WIDTH} from '../../palette/constants';


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
  		
  		const {editor:{w,h,ow,oh,view},actions:{setView}} = this.props;
      
      const canvasstyle ={
        left: PALETTE_WIDTH,
        width: w-PALETTE_WIDTH,
      }

      const actions = [];

      if (view === "editor"){
        actions.push(<Button flat key="toggle" label="live" onClick={setView.bind(null,"live")}>tap_and_play</Button>);
      }else{
        actions.push(<Button flat key="toggle" label="editor" onClick={setView.bind(null,"editor")}>mode_edit</Button>);
      }

    	return (
      	 <div className="editor">
            <DragDropContainer w={w} h={h}>
              <Palette/>
              <div className="canvascontainer" style={canvasstyle}>
                  {view==="editor" && <EditorCanvas w={w} h={h} ow={ow} oh={oh} view={view}/>}
                  {view==="live" && <LiveCanvas w={w} h={h} ow={ow} oh={oh}/>}
              </div> 
            </DragDropContainer>
            <Mapper height={h}/>
            <Toolbar colored title={view} actions={actions} style={{position:'fixed', width:w-MAPPER_WIDTH-PALETTE_WIDTH/*-15*/, background:"#3f51b5", left:PALETTE_WIDTH, bottom:0}}/>
          </div>
    	);
  	}

  	_handleResize(e){
     	  const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      	const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      	this.props.actions.screenResize(w,h);
  	}
}