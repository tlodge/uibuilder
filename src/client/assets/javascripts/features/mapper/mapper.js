// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/mapper';
import {NAME as CANVASNAME, actionCreators as templateActions} from '../canvas'
import {NAME as SOURCENAME} from '../sources'
import {DatasourceManager} from '../../datasources';
// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const TOGGLE_MAPPER  = 'uibuilder/mapper/TOGGLE_MAPPER';
const MAP_FROM  = 'uibuilder/mapper/MAP_FROM';
const MAP_TO = 'uibuilder/mapper/MAP_TO';

// This will be used in our root reducer and selectors

export const NAME = 'mapper';

// Define the initial state for `shapes` module

const initialState: State = {
	open:true,
	mappings:[],
	from:null,
	to:null,
}


const createFrom = (action)=>{
	return {sourceId:action.sourceId, path: action.path}
}

const createTo = (action)=>{
	return {templateId:action.templateId, attribute:action.attribute}
}

const subscribe = (key, sourceId, path, templateId, attribute, onData)=>{
	
	var ds = DatasourceManager.get(sourceId);

	if (ds){
    	ds.emitter.addListener('data', (data)=>{
    		console.log("seend data " );
    		console.log(data);
    		console.log("key is " + key)
    		onData(data[key],sourceId,templateId,attribute,data[path]);
    	});
    } 
}

const createSubscription = (state, action, onData)=>{
	
	switch(action.type){
		case MAP_TO:
			if (state.from){
				subscribe("id", state.from.sourceId, state.from.path, action.templateId, action.attribute, onData);
			}
			break;
	}
}

	

export default function reducer(state: State = initialState, action: any = {}): State {
	switch (action.type){
		
		case TOGGLE_MAPPER:
			return Object.assign({}, state, {open:!state.open});
	
		case MAP_FROM:
			return Object.assign({}, state, {from:createFrom(action)});
		

		case MAP_TO:
			if (state.from){
				//subcribe
				return Object.assign({}, state, {
													mappings: [...state.mappings, {enter:"id", from:state.from, to:createTo(action), /*nodes:[]*/}],
													from: null,
													to: null,
												})
			}
			return state;

		default:	
			return state;
	}
}

// Action Creators
function toggleMapper() {
  return {
    type: TOGGLE_MAPPER,
  };
}

function mapFrom(sourceId, path){
	return {
		type: MAP_FROM,
		sourceId,
		path
	};
}

function createNode(templateId, sourceId, attribute, data){
	return {
		type: ADD_NODE,
		templateId,
		sourceId,
		attribute,
		data,
	}
}

function mapTo(templateId, attribute){
	return (dispatch,getState)=>{
		
		const action = {
			type: MAP_TO,
			templateId,
			attribute,
		}
		
		const onData = (key, sourceId, templateId, attribute, data)=>{
			//if mapping doesn't exist, create new node
			/*const mapping = getState().mapper.mappings.reduce((acc, mapping)=>{
				if (mapping.to.templateId === templateId && mapping.from.sourceId === sourceId){
					return mapping;
				}
				return acc;
			},null);*/

			/*if (mapping && mapping.nodes){
				if (!mapping.nodes(data.id)){
					dispatch(createNode(templateId, sourceId, attribute, data));
				}
				else{
					dispatch(templateActions.updateNodeAttribute(templateId,attribute,data));
				}
			}*/
			console.log("seen some data");
			console.log(`${key} ${sourceId} ${templateId} ${attribute} ${data}`);

			//console.log(mapping);
			dispatch(templateActions.updateNodeAttribute(templateId,key,attribute,data));
		}
		createSubscription(getState().mapper, action, onData);
		dispatch(action);
	}
}

// Selectors
const mapper  = (state) => state[NAME];
const sources = (state) => state[SOURCENAME];
const canvas = (state) => state[CANVASNAME];

export const selector = createStructuredSelector({
  mapper,
  sources,
  canvas,
});

export const actionCreators = {
  toggleMapper,
  mapFrom,
  mapTo,
};