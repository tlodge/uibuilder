import React, { Component } from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as mapperActions, viewConstants, selector } from '../..';
import { actionCreators as shapeActions } from 'features/canvas/';
import { actionCreators as sourceActions } from 'features/sources';

import Schema from "../Schema";
import Attributes from "../Attributes";
import Transformer from "../Transformer";
import Properties  from "../Properties";
import Birth from "../Birth";
import Death from "../Death";

import "./Mapper.scss";
import { Flex, Box } from 'reflexbox'
import '../../../../../styles/index.scss';
import {schemaLookup} from 'utils';
import Paper from 'react-md/lib/Papers';


import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';


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

const _shouldExpand = (path, selectedPath)=>{
    
    if (!selectedPath){
      return false;
    }
    return selectedPath.indexOf(path) != -1;
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
      this.state = { activeTabIndex: 0, propertiesExpanded:false, objectsExpanded:false, mapperExpanded:false, mappingsExpanded:false, birthExpanded:false, deathExpanded:false};
      this._handleTabChange = this._handleTabChange.bind(this);
      this._toggleSelected = this._toggleSelected.bind(this);
  }

  renderSources() {
   

    const {sources:{sources, selected}} = this.props;
    const path = selected;

    //const path = selected ? selected.path[0] : null;

    const srcs = sources.map((source) =>{
        return <Box key={source.id} onClick={this.props.actions.selectSource.bind(null, source.id)}>{source.name}</Box>
    });

    
    const schema = path != null ? <Schema {
                                                ...{
                                                    schema: sources.reduce((acc, source)=>{return (source.id === path) ? source.schema : acc;},{}),
                                                    onSelect: this.props.actions.mapFrom.bind(null, path) 
                                                    }
                                              }
                                    />: null;

                                  
    return <Flex flexColumn={true}>
                  {srcs}
                  {schema}
            </Flex>
  }

  renderTemplate(templateId, path, selectedPath){
      
      const {canvas:{templatesById}} = this.props;
      const template = templatesById[templateId];

      return <div key={templateId}>
                  <li onClick={this._toggleSelected.bind(null, [...path, template.id], template.type, selectedPath)}>
                      {`${template.label} (${template.type})`}
                  </li>
                  {template.type === "group" && _shouldExpand(template.id,selectedPath) && this.renderTree(template.children, [...path, template.id], selectedPath)}
             </div>
  }

  renderTree(templates, path, selectedPath){
      return templates.map((id)=>{
          return <ul key={id}>{this.renderTemplate(id, [...path], selectedPath)}</ul>;
      });
  }

  renderObjects(){
      const {canvas:{selected, templates}} = this.props;
      const {path=null} = selected || [];
      const tree = this.renderTree(templates, [], path);
      return <Flex flexColumn={true}>
              <Box> 
                {tree}
              </Box>
            </Flex>
  }

  renderComponents() {
    
    const {canvas:{templatesById, selected}} = this.props;
    
    const {path=null} = selected || [];
    const [id, ...rest] = path;


    const template = id ? templatesById[id] : null;
   

    const attrs = id != null ? <Attributes {
                                                      ...{
                                                            attributes: Object.keys(schemaLookup(template.type).attributes), 
                                                            onSelect: this.props.actions.mapToAttribute.bind(null, path)
                                                          }
                                                  }
                                      /> : null;
    
    const style = id != null ? <Attributes {
                                                      ...{
                                                            attributes:  Object.keys(schemaLookup(template.type).style), 
                                                            onSelect: this.props.actions.mapToStyle.bind(null,path)
                                                          }
                                                  }
                                      /> : null;

    const transforms = id != null ? <Attributes {
                                                          ...{
                                                              attributes: ["rotate", "scale", "translate"],
                                                              onSelect: this.props.actions.mapToTransform.bind(null, path)
                                                          }
                                                      }
                                      /> : null;
    return  <Flex flexColumn={true}>
                {attrs}
                {style}
                {transforms}
            </Flex>

  }


  renderMapper(){
      const {canvas:{templatesById, selected:{path=null}}} = this.props; 
      
      if (!path || path.lnegth <= 0)
        return null;

      const template = templatesById[path[path.length-1]]

      return  <Box>
                <div style={{paddingBottom:7, fontWeight:"bold"}}>{template.label}</div>
                <Flex>
                    <Box col={6}>{this.renderSources()}</Box>
                    <Box col={6}>{this.renderComponents()}</Box>
                </Flex>
            </Box>
  }

  renderMappings(){
    const {canvas:{templatesById}, sources:{sources}, mapper:{mappings}} = this.props;
  
    return mappings.map((item,i)=>{
        
        const sourceName = sources.reduce((acc,source)=>{
          if (item.from.sourceId === source.id)
            return source.name;
          return acc;
        },item.from.sourceId);

        const [id, ...rest] = item.to.path; 
        const templateName = templatesById[id].label;

        return <div onClick={this.props.actions.selectMapping.bind(null,item)} key={i}>{`${sourceName}:${item.from.key}`}->{`${templateName}:${item.to.property}`}</div>
    })
   
  }

  renderBirthOptions(){
    const {canvas:{selected:{path}}} = this.props;
    return <Birth path={path}/>
  }

  renderDeathOptions(){
     return <Death />
  }



  renderProperties(){

      const { activeTabIndex } = this.state;
      const {canvas:{templatesById, selected:{path}}} = this.props; 
      const template = templatesById[path[path.length-1]]
      return <Properties template={template} updateAttribute={this.props.actions.updateTemplateAttribute.bind(null,path)} updateStyle={this.props.actions.updateTemplateStyle.bind(null,path)}/>
  }

  render() {


    const {mapper:{open, selectedMapping, transformers}, canvas:{selected}, height} = this.props;
    const {propertiesExpanded, objectsExpanded, mappingsExpanded, mapperExpanded, birthExpanded, deathExpanded} = this.state;

    return (
              <div id="mapper" style={{width:viewConstants.MAPPER_WIDTH, boxSizing:'border-box', height: height, overflow:'auto'}}>
                 <Paper key={1} zDepth={1}>
                    <Card className="md-block-centered"  expanded={objectsExpanded} onExpanderClick={()=>{this.setState({objectsExpanded:!objectsExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({objectsExpanded:!objectsExpanded})}}>
                          objects
                        </CardActions>
                        <CardText style={{padding:0}}  expandable>
                          {this.renderObjects()}
                        </CardText>
                    </Card>
                    {selected && <Card className="md-block-centered" defaultExpanded onExpanderClick={()=>{this.setState({propertiesExpanded:!propertiesExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({propertiesExpanded:!propertiesExpanded})}}>
                          properties
                        </CardActions>
                        <CardText style={{padding:0}} expandable>
                          {this.renderProperties()}
                        </CardText>
                    </Card>}
                    {selected &&  <Card className="md-block-centered" expanded={birthExpanded} onExpanderClick={()=>{this.setState({birthExpanded:!birthExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({birthExpanded:!birthExpanded})}}>
                            birth
                        </CardActions>
                        <CardText expandable>
                          {this.renderBirthOptions()}
                        </CardText>
                    </Card>}
                    {selected && <Card className="md-block-centered" expanded={deathExpanded} onExpanderClick={()=>{this.setState({deathExpanded:!deathExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({deathExpanded:!deathExpanded})}}>
                          death
                        </CardActions>
                        <CardText expandable>
                           {this.renderDeathOptions()}
                        </CardText>
                    </Card>}
                    {selected && <Card className="md-block-centered" expanded={mapperExpanded} onExpanderClick={()=>{this.setState({mapperExpanded:!mapperExpanded})}}>
                        <CardActions expander onClick={()=>{this.setState({mapperExpanded:!mapperExpanded})}}>
                          behaviour
                        </CardActions>
                        <CardText expandable>
                          {this.renderMapper()}
                          {this.renderMappings()}
                          {selectedMapping && <Transformer selectedMapping={selectedMapping} transformer={transformers[selectedMapping.mappingId]} saveDialog={this.props.actions.saveTransformer.bind(null, selectedMapping.mappingId)} closeDialog={this.props.actions.selectMapping.bind(null,null)}/>}
                        </CardText>
                    </Card>}
                  </Paper>
              </div>
           );
  }


   _handleTabChange(activeTabIndex) {
      this.setState({ activeTabIndex });
   }

   _toggleSelected(path,type,selectedPath){

      //toogle here by checking laste elements of each path;
      if (selectedPath != null && path.length > 0 && type==="group"){
          const id1 = selectedPath[selectedPath.length-1];
          const id2 = path[path.length-1];
          if (id1 === id2){
            this.props.actions.templateParentSelected();
            return;
          }
      }
      this.props.actions.templateSelected({path:path, type:type});
      
   }
}