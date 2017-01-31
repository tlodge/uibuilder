import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {camelise} from 'utils';
import { actionCreators as canvasActions, selector } from '../..';
import { connect } from 'react-redux';

@connect(selector, (dispatch) => {
  return{
     actions: bindActionCreators(canvasActions, dispatch)
  }
})

export default class Path extends Component {
	render(){
		const {id,template,selected} = this.props;
		const {d,style} = template;
		const _style = camelise(style);

		if (selected){
			_style.stroke = "#3f51b5";
			_style.strokeWidth = 2;
		}
		return <path d={d} style={_style} />
	}
}