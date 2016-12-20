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
	return {templateId:action.template.templateId, type:action.template.type, property:action.property}
}

const subscribe = (enterKey, source, template, onData)=>{

	var ds = DatasourceManager.get(source.sourceId);

	if (ds){
    	ds.emitter.addListener('data', (data)=>{
    		onData(data[enterKey],source,template,resolvePath(data, source.path, source.key));
    	});
    } 
}

const createSubscription = (state, action, onData)=>{
	
	switch(action.type){
		case MAP_TO:
			if (state.from){
				subscribe("id", 
							{
								sourceId: state.from.sourceId, 
								path: state.from.path, 
								key: state.from.key,
								type: state.from.type,
							},
							{
								templateId: action.template.templateId,
								type: action.template.type,
								property: action.property,
							}, 
							onData.bind(null, action.mappingId)
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
				//subcribe
				return Object.assign({}, state, {
													mappings: [...state.mappings, {mappingId: action.mappingId, enter:"id", from:state.from, to:createTo(action), /*nodes:[]*/}],
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

function mapTo(template, property){
	return (dispatch,getState)=>{
		
		dispatch(templateActions.templateSelected(template));

		const action = {
			type: MAP_TO,
			template,
			property,
			mappingId: generateId(),
		}
		
		//TODO: what other things can, should we pass into the mapper transform to make use of?
		const onData = (mappingId, enterKey, source, template, value)=>{
			const transformer = getState().mapper.transformers[mappingId] || `return ${source.key}`;
			const transform = Function(source.key, transformer);
			
			console.log("************************ transformer is ********************************");
			console.log(transformer);
			console.log("************************* applying to " + value + " is ****************** ");
			console.log(`**************************** ${transform(value)} *************************`);

			
			dispatch(templateActions.updateNodeProperty(template.templateId,enterKey,template.property,transform(value)));
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
  mapTo,
  selectMapping,
  saveTransformer,
};