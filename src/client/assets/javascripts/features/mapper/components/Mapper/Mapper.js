import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mapperActions, viewConstants, selector } from '../..';
import { actionCreators as shapeActions } from '../../../canvas';
import { actionCreators as sourceActions } from '../../../sources';

import Schema from "../Schema";
import Attributes from "../Attributes";
import Transformer from "../Transformer";
import Properties  from "../Properties";

import "./Mapper.scss";
import { Flex, Box } from 'reflexbox'
import '../../../../../styles/index.scss';
import Paper from 'react-md/lib/Papers';
import {schemaLookup} from '../../../../utils';


const sourceName = (sources, sourceId)=>{
  for (source in sources){
      if (sourceId === source.id){
          return source.name;
      }
  }
  return sourceId;
}

const templateName = (templates, templateId)=>{
  for (template in templates){
    if (template.id === templateId){
      return template.label;
    }      
  }
  return templateId;
}

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
  
  
  constructor(props){
      super(props);
      this.state = { activeTabIndex: 0};
      this._handleTabChange = this._handleTabChange.bind(this);
  }

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
                                    />: null;

                                  
    return <Flex flexColumn={true}>
                  {srcs}
                  {schema}
            </Flex>
  }

  renderComponents() {
    
    const {canvas:{templates, selected}} = this.props;

    const tmplts = Object.keys(templates).map((key,i)=>{
      const shape = templates[key];
      const style = {
        fontWeight: selected && selected.templateId === shape.id ? "bold" : "normal", 
      }
      return <Box key={i} style={style} onClick={this.props.actions.templateSelected.bind(null, {templateId:shape.id, type:shape.type})}>{shape.label}></Box>
    });


    const attrs = selected != null ? <Attributes {
                                                      ...{
                                                            attributes: Object.keys(schemaLookup(templates[selected.templateId].type).attributes), 
                                                            onSelect: this.props.actions.mapToAttribute.bind(null, selected)
                                                          }
                                                  }
                                      /> : null;
    
    const style = selected != null ? <Attributes {
                                                      ...{
                                                            attributes:  Object.keys(schemaLookup(templates[selected.templateId].type).style), 
                                                            onSelect: this.props.actions.mapToStyle.bind(null, selected)
                                                          }
                                                  }
                                      /> : null;

    const transforms = selected != null ? <Attributes {
                                                          ...{
                                                              attributes: ["transform"],
                                                              onSelect: this.props.actions.mapToTransform.bind(null, selected)
                                                          }
                                                      }
                                      /> : null;
    return  <Flex flexColumn={true}>
                {tmplts}
                {attrs}
                {style}
                {transforms}
            </Flex>

  }


  renderMappings(){
    const {canvas:{templates}, sources:{sources}, mapper:{mappings}} = this.props;
  
    return mappings.map((item,i)=>{
        
        const sourceName = sources.reduce((acc,source)=>{
          if (item.from.sourceId === source.id)
            return source.name;
          return acc;
        },item.from.sourceId);

        const templateName = templates[item.to.templateId].label;

        return <div onClick={this.props.actions.selectMapping.bind(null,item)} key={i}>{`${sourceName}:${item.from.path}`}->{`${templateName}:${item.to.property}`}</div>
    })
  }

  renderProperties(){
      const { activeTabIndex } = this.state;
      const {canvas:{templates, selected}} = this.props;
      const template  = templates[selected.templateId];

      return <Properties template={template} updateAttribute={this.props.actions.updateTemplateAttribute.bind(null,selected.templateId)} updateStyle={this.props.actions.updateTemplateStyle.bind(null,selected.templateId)}/>
  }

  render() {

    const {mapper:{open, selectedMapping, transformers}, canvas:{selected}} = this.props;
   
    return (
              <div id="mapper" style={{width:viewConstants.MAPPER_WIDTH}}>
                 <Paper key={1} zDepth={1}>
                  <Flex flexColumn={true}>
                    {selected && this.renderProperties()}
                    <Box><h2>mapper</h2></Box>
                    <Flex>
                      <Box col={6}>{this.renderSources()}</Box>
                      <Box col={6}>{this.renderComponents()}</Box>
                    </Flex>
                    <Box><h2>mappings</h2></Box>
                    <Box>
                      {this.renderMappings()}
                      {selectedMapping && <Transformer selectedMapping={selectedMapping} transformer={transformers[selectedMapping.mappingId]} saveDialog={this.props.actions.saveTransformer.bind(null, selectedMapping.mappingId)} closeDialog={this.props.actions.selectMapping.bind(null,null)}/>}
                    </Box>
                  </Flex>

                  </Paper>
              </div>
           );
  }

   _handleTabChange(activeTabIndex) {
      this.setState({ activeTabIndex });
   }
}