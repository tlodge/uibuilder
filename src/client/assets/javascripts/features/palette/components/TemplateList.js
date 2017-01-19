import React, { Component, PropTypes } from 'react';

import TemplateItem from './TemplateItem';
import { Flex, Box } from 'reflexbox'

export default class TemplateList extends Component {
  
  static propTypes = {
    actions: PropTypes.object.isRequired,
    templates: PropTypes.array.isRequired
  };

  renderList() {
    return this.props.templates.map((template) =>
      (
        <TemplateItem
          key={template.id}
          id={template.id}
          name={template.name}
          type={template.type}
          children={template.children}
          selected={this.props.selected===template.id}
          {...this.props.actions} />
      )
    );
  }

  render() {
    return (
      <Flex column align="center" justify="center">
        {this.renderList()}
      </Flex>
    );
  }
}
