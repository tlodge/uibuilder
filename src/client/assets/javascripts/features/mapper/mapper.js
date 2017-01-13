// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/mapper';
import {NAME as CANVASNAME, actionCreators as templateActions} from '../canvas'
import {NAME as SOURCENAME} from '../sources'
import {DatasourceManager} from '../../datasources';
import {generateId} from '../../utils';
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


const resolvePath = (obj, path, key)=>{
	const parent = path.reduce((acc,item)=>{
		return acc[item];
	},obj)

	return parent[key];
}

const createFrom = (action)=>{
	return {sourceId:action.sourceId, key: action.key, path: action.path, type:action.typedef}
}

const createTo = (action)=>{
	return {path:action.path, type:action.shape, property:action.property, enterKey: action.enterkey}
}

const subscribe = (source, template, onData, enterKey)=>{
	console.log("in subscribe and template is");
	console.log(template);

	var ds = DatasourceManager.get(source.sourceId);
	

	if (ds){
    	ds.emitter.addListener('data', (data)=>{
    		const enterKey = template.enterKey ? data[template.enterKey] : null;
    		onData(source,template,resolvePath(data, source.path, source.key),enterKey);
    	});
    } 
}

const createSubscription = (state, action, onData)=>{
	
	switch(action.type){
		case MAP_TO:
			if (state.from){
				subscribe(	{
								sourceId: state.from.sourceId, 
								path: state.from.path, 
								key: state.from.key,
								type: state.from.type,
							},
							{
								path: action.path,
								type: action.shape,
								property: action.property,
								enterKey: action.enterKey,
							}, 
							onData.bind(null, action.mappingId),
							/*"id"*/
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
													mappings: [...state.mappings, {mappingId: action.mappingId, from:state.from, to:createTo(action), /*nodes:[]*/}],
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

function mapToAttribute(template, property){
	
	const {path, shape, enterKey} = template;

	return (dispatch,getState)=>{
		
		//dispatch(templateActions.templateSelected(path)); //should be {path} - if needed which don't think is!

		const action = {
			type: MAP_TO,
			path,
			shape,
			enterKey,
			property,
			mappingId: generateId(),
		}
		
		//TODO: what other things can, should we pass into the mapper transform to make use of?
		const onData = (mappingId, source, template, value, enterKey)=>{
			const transformer = getState().mapper.transformers[mappingId] || `return ${source.key}`;
			const transform = Function(source.key, transformer);
			dispatch(templateActions.updateNodeAttribute(template.path,property,transform(value), enterKey));
		}

		createSubscription(getState().mapper, action, onData);
		dispatch(action);
	}
}

function mapToStyle(template, property){
	const {path, shape, enterKey} = template;
	return (dispatch,getState)=>{

		//dispatch(templateActions.templateSelected(template));

		const action = {
			type: MAP_TO,
			path,
			shape,
			enterKey,
			property,
			mappingId: generateId(),
		}

		const onData = (mappingId, source, template, value, enterKey)=>{
			const transformer = getState().mapper.transformers[mappingId] || `return ${source.key}`;
			const transform = Function(source.key, transformer);
			dispatch(templateActions.updateNodeStyle(template.path,property,transform(value), enterKey));
		}
		createSubscription(getState().mapper, action, onData);
		dispatch(action);
	}
}


function mapToTransform(template, property){
	const {path, shape, enterKey} = template;
	return (dispatch, getState)=>{
		//dispatch(templateActions.templateSelected(template));

		const action = {
			type: MAP_TO,
			path,
			shape,
			enterKey,
			property,
			mappingId: generateId(),
		}

		const onData = (mappingId, source, template, value, enterKey)=>{
			const sf = Math.random() * 2;
			const transformer = getState().mapper.transformers[mappingId] || `return "scale(${sf})"`;
			const transform = Function(source.key, transformer);
			dispatch(templateActions.updateNodeTransform(template.path,transform(value), enterKey));
		}

		createSubscription(getState().mapper, action, onData);
		dispatch(action);
	}
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