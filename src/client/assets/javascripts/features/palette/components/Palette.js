import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { actionCreators as paletteActions, selector } from '../';
import PaletteLayout from './PaletteLayout';

@connect(selector, (dispatch) => ({
  actions: bindActionCreators(paletteActions, dispatch)
}))
export default class Palette extends Component {
  render() {
    return (
      <div>
        <PaletteLayout {...this.props} />
      </div>
    );
  }
}