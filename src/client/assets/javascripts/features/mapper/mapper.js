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
const SUBSCRIBE_MAPPINGS = 'uibuilder/mapper/SUBSCRIBE_MAPPINGS';
const UNSUBSCRIBE_MAPPINGS = 'uibuilder/mapper/UNSUBSCRIBE_MAPPINGS';
const SAVE_TRANSFORMER = 'uibuilder/mapper/SAVE_TRANSFORMER';
const SUBSCRIBED = 'uibuilder/mapper/SUBSCRIBED';
const UNSUBSCRIBED = 'uibuilder/mapper/UNSUBSCRIBED';

// This will be used in our root reducer and selectors
export const NAME = 'mapper';

// Define the initial state for `shapes` module

let _listeners = [];

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

const _function_for = (ttype)=>{
	switch (ttype){

		case "attribute":
			return liveActions.updateNodeAttribute;

		case "transform":
			return liveActions.updateNodeTransform;

		case "style":
 			return liveActions.updateNodeStyle;

		default: 
			return null;

	}
}

const _subscribe = (mapping, onData, onRemove)=>{
	var ds = DatasourceManager.get(mapping.from.sourceId);
	if (ds){
		
		const propertyFor = resolvePath.bind(null, mapping.from.key, mapping.from.path);
		let count = 0;

		return  ds.emitter.addListener('data', (data)=>{
			
    		const enterKey = mapping.to.enterFn ? mapping.to.enterFn(data,count) : null;
    		const remove   = count > 3;// mapping.to.exitFn ? mapping.to.exitFn(data, count) : false; 

    		if (remove){
    			onRemove(mapping.to.path,enterKey);
    		}else{
    			onData(mapping.mappingId, mapping.from.key, mapping.to.path, mapping.to.property, propertyFor(data), count, enterKey);
    		}
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


const _removeSubscriptions = ()=>{

	for (let i = 0; i < _listeners.length; i++){
		_listeners[i].remove();
	}
	_listeners = [];
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
													mappings: [...state.mappings, {mappingId: action.mappingId, ttype:action.ttype, from:state.from, to:createTo(action) /*nodes:[]*/}],
													from: null,
													to: null,
												})
			}
			return state;

		case SELECT_MAPPING:
			return Object.assign({},state,{selectedMapping:action.mapping});

		case SUBSCRIBE_MAPPINGS:
			_createSubscriptions(state);
			return state;

		case UNSUBSCRIBE_MAPPINGS:
			_removeSubscriptions(state);
			return state;

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

function mapTo(ttype, path, property){

	return (dispatch,getState)=>{
	
		const template = getState().canvas.templatesById[path[path.length-1]];
		
		const action = {
			type: MAP_TO,
			path,
			ttype,
			property,
			enterFn:template.enterFn,
			shape: template.type,
			mappingId: generateId(),
			
		}
		dispatch(action);
	}
}

function subscribeMappings(){

	return (dispatch, getState)=>{
		const {mapper:{mappings}} = getState();

		for (let i = 0; i < mappings.length; i++){
			
			const fn = _function_for(mappings[i].ttype);
			if (fn){

				const onData = (mappingId, key, path, property, value, count, enterKey)=>{
					const {nodesByKey, nodesById} = getState().live;
					const node = _getNode(nodesByKey, nodesById, enterKey, path); 
					const transformer = getState().mapper.transformers[mappingId] || defaultCode(key,property);
					const transform = Function(key, "node", "i", transformer);		
					dispatch(fn(path,property,transform(value, node, count), enterKey, Date.now(), count));
				}

				const onRemove = (path,enterKey)=>{
					const {nodesByKey, nodesById} = getState().live;
					const node = _getNode(nodesByKey, nodesById, enterKey, path);
					if (node && node.id){
						dispatch(liveActions.removeNode(node.id, path, enterKey));
					}
				}

				_listeners.push(_subscribe(mappings[i], onData, onRemove));
			}
		}
		dispatch({type: SUBSCRIBED});
	}
}

function unsubscribeMappings(){
	_removeSubscriptions();

	return {
		type: UNSUBSCRIBED
	}
}

function mapToAttribute(path, property){
	return mapTo("attribute", path, property);
}

function mapToStyle(path, property){
	return mapTo("style", path, property);
}

function mapToTransform(path, property){
	return mapTo("transform", path, property);
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
  subscribeMappings,
  unsubscribeMappings,
};