import React, { PureComponent } from 'react';
import { Flex, Box } from 'reflexbox'
import Schema from "../Schema";
import { actionCreators as templateActions } from 'features/canvas/';
import { selector } from '../..';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {resolvePath} from 'utils';

@connect(selector, (dispatch) => {
  return {
      actions: bindActionCreators(templateActions, dispatch)
  }
})

export default class Birth extends PureComponent {
  
  constructor(props) {
    super(props);
    this.state = { sourceId: null, type:"static"}; 
    this._selectSource = this._selectSource.bind(this);
    this._selectType = this._selectType.bind(this);
  }

  renderKeys() {
   

    const {sources:{sources}, path} = this.props;
   

    const srcs = sources.map((source) =>{
        return <Box key={source.id} onClick={this._selectSource.bind(null, source.id)}>{source.name}</Box>
    });

    const schemas = sources.reduce((acc, source)=>{
                                                    return (source.id === this.state.sourceId) ? source.schema : acc
                                                  },{});

    const schema =   <Schema schema={schemas} onSelect={(key,sourcepath)=>{
        const valueFor = resolvePath.bind(null,key,sourcepath); 
        this.props.actions.updateTemplateAttribute(path, "enterFn", (data)=>valueFor(data));
    }}/>
          
                              
    return <Flex flexColumn={true}>
                  {srcs}
                  {schema}
            </Flex>
 }

 renderFunction() {
   

    const {sources:{sources},path} = this.props;
   
    const srcs = sources.map((source) =>{
        return <Box key={source.id} onClick={this._selectSource.bind(null, source.id)}>{source.name}</Box>
    });

    const schemas = sources.reduce((acc, source)=>{
                                                    return (source.id === this.state.sourceId) ? source.schema : acc
                                                  },{});

    const schema =   <Schema schema={schemas} onSelect={(key,sourcepath)=>{
        const valueFor = resolvePath.bind(null,key,sourcepath); 
        let count = 0;
        this.props.actions.updateTemplateAttribute(path, "enterFn", (data)=>{
            return (count++)%15
            //return Math.abs(Math.floor(valueFor(data)))%100;
        });
    }}/>
                  
                              
    return <Flex flexColumn={true}>
                  {srcs}
                  {schema}
            </Flex>
 }

 render() {
    const {type} = this.state;

    return (
      <div>
        <ul>
          <li onClick={this._selectType.bind(null, "static")}>
              <strong> static </strong>
          </li>
          <li onClick={this._selectType.bind(null, "key")}>
            <strong> bind to data key </strong>
            {type==="key" && this.renderKeys()}
          </li>
          <li onClick={this._selectType.bind(null, "function")}>
            <strong> bind to data function </strong>
             {type==="function" && this.renderFunction()}
          </li>
        </ul>
      </div>
    );
  }


  _selectType(type){
    this.setState({type});
  }

  _selectSource(sourceId){
    this.setState({sourceId});
  }

}