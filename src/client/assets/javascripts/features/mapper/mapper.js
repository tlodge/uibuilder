// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/mapper';
import {NAME as CANVASNAME, actionCreators as templateActions} from '../canvas/'
import {NAME as LIVENAME, actionCreators as liveActions} from '../live'
import {NAME as SOURCENAME} from '../sources'
import {DatasourceManager} from '../../datasources';
import {generateId, defaultCode, resolvePath} from 'utils';
// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const TOGGLE_MAPPER  = 'uibuilder/mapper/TOGGLE_MAPPER';
const MAP_FROM  = 'uibuilder/mapper/MAP_FROM';
const MAP_TO = 'uibuilder/mapper/MAP_TO';
const SELECT_MAPPING = 'uibuilder/mapper/SELECT_MAPPING';
const SAVE_TRANSFORMER = 'uibuilder/mapper/SAVE_TRANSFORMER';

// This will be used in our root reducer and selectors
export const NAME = 'mapper';

// Define the initial state for `shapes` module

const initialState: State = {
	open:true,
	mappings:[],
	from:null,
	to:null,
	selectedMapping: null,
	transformers:{},
}

const createFrom = (action)=>{
	return {sourceId:action.sourceId, key: action.key, path: action.path, type:action.typedef}
}

const createTo = (action)=>{
	return {path:action.path, type:action.shape, property:action.property, enterFn: action.enterFn}
}

const subscribe = (source, template, onData)=>{
	
	var ds = DatasourceManager.get(source.sourceId);
	const propertyFor = resolvePath.bind(null, source.key, source.path);

	if (ds){
		let count = 0;
    	ds.emitter.addListener('data', (data)=>{
    		const enterKey = template.enterFn ? template.enterFn(data,count) : null;
    		onData(source,template,propertyFor(data),count,enterKey);
    		count+=1;
    	});
    } 
}

const _defaultTransform = (type)=>{
	
	switch (type){
		case "rotate":
			return "rotate(0)";

		case "translate":
			return "translate(0,0)";

		case "scale":
			return "scale(1)";

		default:
			return "translate(0,0)";
	}
}

const _getNode = (nodesByKey, nodesById, enterKey, path)=>{
	if (path && path.length >= 1){
		const id 	  = path[path.length-1];
		const key 	  = enterKey || "root";
		const nodeId  = nodesByKey[id] ? nodesByKey[id][key] : null;
		return nodeId ? nodesById[nodeId] : {};
	}
	return {};
}

const createSubscription = (from, action, onData)=>{

	switch(action.type){
		case MAP_TO:
			if (from){
				subscribe(	{
								sourceId: from.sourceId, 
								path: from.path, 
								key: from.key,
								type: from.type,
							},
							{
								path: action.path,
							    property: action.property,
								enterFn: action.enterFn,
							}, 
							onData.bind(null, action.mappingId),
						);
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
				return Object.assign({}, state, {
													mappings: [...state.mappings, {mappingId: action.mappingId, from:state.from, to:createTo(action) /*nodes:[]*/}],
													from: null,
													to: null,
												})
			}
			return state;

		case SELECT_MAPPING:
			return Object.assign({},state,{selectedMapping:action.mapping});

		case SAVE_TRANSFORMER:
			return Object.assign({},state,{transformers:Object.assign({}, state.transformers, {[action.mappingId]:action.transformer})});

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

function mapFrom(sourceId, key, path, type){
	return {
		type: MAP_FROM,
		sourceId,
		key,
		path,
		typedef:type,
	};
}

function mapTo(path, property, fn){
	return (dispatch,getState)=>{
	
		const template = getState().canvas.templatesById[path[path.length-1]];
	
		const action = {
			type: MAP_TO,
			path,
			property,
			enterFn:template.enterFn,
			shape: template.type,
			mappingId: generateId(),
		}

		//TODO: what other things can, should we pass into the mapper transform to make use of?
		const onData = (mappingId, source, template, value, count, enterKey)=>{
			const transformer = getState().mapper.transformers[mappingId] || defaultCode(source.key,property);
			const transform = Function(source.key, "node", "i", transformer);	
			const {nodesByKey, nodesById} = getState().live;
			const node = _getNode(nodesByKey, nodesById, enterKey, template.path);
			dispatch(fn(template.path,property,transform(value, node, count), enterKey));
		}

		createSubscription(getState().mapper.from, action, onData);
		dispatch(action);
	}
}


function mapToAttribute(path, property){
	return mapTo(path,property, liveActions.updateNodeAttribute);
}

function mapToStyle(path, property){
	return mapTo(path,property, liveActions.updateNodeStyle);
}

function mapToTransform(path, property){
	return mapTo(path,property, liveActions.updateNodeTransform);
}

function selectMapping(mapping){
	return {
		type: SELECT_MAPPING,
		mapping,
	}
}

function saveTransformer(mappingId, transformer){
	return (dispatch,getState)=>{
		dispatch(selectMapping(null));
	
		dispatch({
			type: SAVE_TRANSFORMER,
			mappingId,
			transformer,
		})
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
  mapToAttribute,
  mapToStyle,
  mapToTransform,
  selectMapping,
  saveTransformer,
};