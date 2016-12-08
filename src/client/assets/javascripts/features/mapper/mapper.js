// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/mapper';
import {NAME as CANVASNAME, actionCreators as shapeActions} from '../canvas'
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
	return {shapeId:action.shapeId, attribute:action.attribute}
}

const subscribe = (sourceId, path, shapeId, attribute, onData)=>{
	console.log("getting source iD");
	console.log(sourceId);

	var ds = DatasourceManager.get(sourceId);

	if (ds){
		console.log("GREAT GOT Ds!!!!!");

    	ds.emitter.addListener('data', (data)=>{
    		console.log("seen some data!!");
    		console.log(data);
    		console.log(path);
    		console.log("*****")
    		onData(shapeId,attribute,data[path]);
    	});
    } 
}

const createSubscription = (state, action, onData)=>{
	console.log("am in create subscription!!");

	switch(action.type){
		case MAP_FROM:
			if (state.to){
				subscribe(action.sourceId, action.path, state.to.shapeId, state.to.attribute, onData);
			}
			break;

		case MAP_TO:
			if (state.from){
				subscribe(state.from.sourceId, state.from.path, action.shapeId, action.attribute, onData);
			}
			break;
	}
}

	

export default function reducer(state: State = initialState, action: any = {}): State {
	switch (action.type){
		
		case TOGGLE_MAPPER:
			return Object.assign({}, state, {open:!state.open});
	
		case MAP_FROM:
			if (state.to){
				return Object.assign({}, state, {
												mappings: [...state.mappings, {from: createFrom(action), to:state.to}],
												from: null,
												to: null,
											});
			}else{
				return Object.assign({}, state, {from:createFrom(action)});
			}

		case MAP_TO:
			if (state.from){
				//subcribe
				return Object.assign({}, state, {
													mappings: [...state.mappings, {from:state.from, to:createTo(action)}],
													from: null,
													to: null,
												})
			}
			else{
				return Object.assign({}, state, {to:createTo(action)})
			}

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
	return (dispatch,getState)=>{
		const action = {
			type: MAP_FROM,
			sourceId,
			path
		}

		const onData = (id, attribute, data)=>{
			dispatch(shapeActions.updateAttribute(id,attribute,data));
		}
		createSubscription(getState().mapper, action, onData);
		dispatch(action);
	}
}

function mapTo(shapeId, attribute){
	return (dispatch,getState)=>{
		
		const action = {
			type: MAP_TO,
			shapeId,
			attribute,
		}
		const onData = (id, attribute, data)=>{
			dispatch(shapeActions.updateAttribute(id,attribute,data));
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