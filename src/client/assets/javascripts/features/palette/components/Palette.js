import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as paletteActions, viewConstants, selector } from '../';
import "./Palette.scss";

import PaletteLayout from './PaletteLayout';

@connect(selector, (dispatch) => {
	return {
  		actions: bindActionCreators(paletteActions, dispatch)
	}
})

export default class Palette extends Component {
  render() {
    return (
      <div className="palettecontainer" style={{width:viewConstants.PALETTE_WIDTH}}>
        <PaletteLayout {...this.props} />
      </div>
    );
  }
}