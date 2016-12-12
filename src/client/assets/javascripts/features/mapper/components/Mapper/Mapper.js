import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mapperActions, viewConstants, selector } from '../..';
import { actionCreators as shapeActions } from '../../../canvas';
import { actionCreators as sourceActions } from '../../../sources';

import Schema from "../Schema";
import Attributes from "../Attributes";

import "./Mapper.scss";
import { Flex, Box } from 'reflexbox'

@connect(selector, (dispatch) => {
  return {
  		actions: {
                  ...bindActionCreators(mapperActions, dispatch), 
                  ...bindActionCreators(sourceActions, dispatch), 
                  ...bindActionCreators(shapeActions, dispatch)
      }
	}
})


export default class Mapper extends Component {
  
  renderSources() {

    const {sources:{sources, selected}} = this.props;
    
    const srcs = sources.map((source) =>{
        return <Box key={source.id} onClick={this.props.actions.selectSource.bind(null, source.id)}>{source.name}</Box>
    });

    
    const schema = selected != null ? <Schema {
                                                ...{
                                                    schema: sources.reduce((acc, source)=>{return (source.id === selected) ? source.schema : acc;},{}),
                                                    onSelect: this.props.actions.mapFrom.bind(null, selected) 
                                                    }
                                              }
                                    /> : null;

                                  
    return <Flex flexColumn={true}>
              {srcs}
              {schema}
            </Flex>
  }

  renderComponents() {
    
    const {canvas:{templates, selected}} = this.props;

    const tmplts = templates.map((shape,i)=>{
      return <Box key={i} onClick={this.props.actions.templateSelected.bind(null, shape.id)}>{shape.label}></Box>
    });

    const attrs = selected != null ? <Attributes {
                                                      ...{
                                                            attributes: templates.reduce((acc, template)=>{return (template.id === selected) ? Object.keys(template) : acc;},[]),
                                                            onSelect: this.props.actions.mapTo.bind(null, selected)
                                                          }
                                                  }
                                      /> : null;
    
    return  <Flex flexColumn={true}>
              {tmplts}
              {attrs}
            </Flex>

  }

  render() {

    const {mapper:{open}} = this.props;
    return (<div id="mapper" style={{width:viewConstants.MAPPER_WIDTH}}>
                <Flex>
                  <Box col={6}>{this.renderSources()}</Box>
                  <Box col={6}>{this.renderComponents()}</Box>
                </Flex>
            </div>);
  }
}