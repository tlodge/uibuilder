import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators as editorActions, selector } from '../';
import Dialog from 'react-md/lib/Dialogs';
import {get} from 'utils/net';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';

@connect(selector, (dispatch) => {
  return{
     actions: {...bindActionCreators(editorActions, dispatch)}
  }
})

export default class LoadScene extends PureComponent {

	constructor(props,context){
		  super(props,context);

  }		
  
  componentDidMount(){
      get('/scenes').then((scenes)=>{
          this.props.actions.setScenes(JSON.parse(scenes.text));
      });
  }

  renderSceneList(){
      const {editor:{scenes}, onLoad} = this.props;
      
      const listitems = scenes.map((scene,i)=>{
          return <ListItem key={i} primaryText={scene} onClick={onLoad.bind(null,scene)}/>
      });
      return <List style={{width:"100%"}}>{listitems}</List>
  }

  render() {

       const {visible, onHide} = this.props;

  		 const actions = [
          {
            onClick: onHide,
            primary: true,
            label: 'cancel',
          }
      ];
    	return (<Dialog id="load" visible={visible} title="Load new scene" onHide={onHide} aria-labelledby="loadDescription" modal actions={actions}>     
                  {this.renderSceneList()}   
              </Dialog>);

  }
}