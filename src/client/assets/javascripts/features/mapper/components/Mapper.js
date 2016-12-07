import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mapperActions, viewConstants, selector } from '../';
import "./Mapper.scss";

@connect(selector, (dispatch) => {
	return {
  		actions: bindActionCreators(mapperActions, dispatch)
	}
})

export default class Mapper extends Component {

  render() {
    const {mapper:{open}} = this.props;
    return (<div id="mapper" style={{width:viewConstants.MAPPER_WIDTH}}></div>);
  }
}